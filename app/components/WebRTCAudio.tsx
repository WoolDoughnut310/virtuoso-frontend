import { useEffect, useRef } from "react";

export default function WebRTCAudio() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const pc = new RTCPeerConnection();
        const ws = new WebSocket("ws://localhost:8000/ws");

        pc.addTransceiver("audio", { direction: "recvonly" });

        pc.ontrack = (event) => {
            if (audioRef.current) {
                audioRef.current.srcObject = event.streams[0];
                audioRef.current.play().catch(console.error);
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                ws.send(
                    JSON.stringify({ type: "ice", candidate: e.candidate })
                );
            }
        };

        ws.onmessage = async (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "answer") {
                await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
            } else if (msg.type === "ice") {
                await pc.addIceCandidate(msg.candidate);
            }
        };

        async function start() {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            ws.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
            audioRef?.current?.play().catch(console.error);
        }

        ws.onopen = () => {
            start();
        };

        return () => {
            pc.close();
            ws.close();
        };
    }, []);

    return <audio ref={audioRef} autoPlay controls />;
}
