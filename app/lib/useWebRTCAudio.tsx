import { type RefObject, useEffect, useRef, useCallback, useState } from "react";

export default function useWebRTCAudio(audioRef: RefObject<HTMLAudioElement | null>) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
	const pcRef = useRef<RTCPeerConnection | null>(null);
	const wsRef = useRef<WebSocket | null>(null);

	const start = useCallback(async () => {
		// Avoid creating multiple connections
		if (pcRef.current || wsRef.current) return;

		const pc = new RTCPeerConnection();
		const ws = new WebSocket("ws://localhost:8000/ws");

		pcRef.current = pc;
		wsRef.current = ws;

		// Receive audio only
		pc.addTransceiver("audio", { direction: "recvonly" });

		// Handle incoming tracks
		pc.ontrack = (event) => {
			if (audioRef.current) {
				audioRef.current.srcObject = event.streams[0];
				// Try to autoplay, handle errors gracefully
                setIsLoading(false);
				audioRef.current
					.play()
					.catch((err) => {
                        console.warn("Autoplay blocked:", err);
                        setError(err);
                    });
			}
		};

		// Send ICE candidates over WebSocket
		pc.onicecandidate = (e) => {
			if (e.candidate && ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ type: "ice", candidate: e.candidate }));
			}
		};

		// Handle messages from signaling server
		ws.onmessage = async (event) => {
			const msg = JSON.parse(event.data);
			if (msg.type === "answer") {
				await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
			} else if (msg.type === "ice") {
				try {
					await pc.addIceCandidate(msg.candidate);
				} catch (err) {
					console.warn("Error adding ICE candidate:", err);
                    setError(err as string);
				}
			}
		};

		// Wait for WebSocket to open before sending the offer
		ws.onopen = async () => {
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			ws.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
		};

        setIsLoading(true);
	}, [audioRef]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			pcRef.current?.close();
			wsRef.current?.close();
			pcRef.current = null;
			wsRef.current = null;
		};
	}, []);

	return { start, isLoading, error };
}
