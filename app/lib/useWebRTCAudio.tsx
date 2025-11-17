import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type RefObject,
} from "react";
import type { FloatingEmoji } from "~/routes/live";

export interface LatestReaction {
    emoji: string;
}

type StreamStatus = "idle" | "connecting" | "connected" | "error";

export default function useWebRTCAudio(
    audioRef: RefObject<HTMLAudioElement | null>,
    concertId: string | number
) {
    const WS_URL = `ws://localhost:8000/concerts/${concertId}`;

    const [status, setStatus] = useState<StreamStatus>("idle");
    const [error, setError] = useState("");
    const [latestReaction, setLatestReaction] = useState<LatestReaction | null>(
        null
    );
    const [audioLevels, setAudioLevels] = useState([0, 0, 0]);

    const wsRef = useRef<WebSocket | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const unmounted = useRef(false);

    const cleanup = useCallback(() => {
        try {
            wsRef.current?.close();
        } catch {}
        try {
            pcRef.current?.getSenders().forEach((s) => s.track?.stop());
        } catch {}
        try {
            pcRef.current?.getReceivers().forEach((r) => r.track?.stop());
        } catch {}
        try {
            pcRef.current?.close();
        } catch {}
        try {
            const audio = audioRef.current;
            if (audio) audio.srcObject = null;
        } catch {}
    }, [audioRef]);

    const attemptPlay = useCallback(async () => {
        const audio = audioRef.current;
        console.log("hi");
        if (!audio) return;

        try {
            console.log("attempting play");
            await audio.play();
            setStatus("connected");
            setError("");

            const audioCtx = new window.AudioContext();
            const source = audioCtx.createMediaStreamSource(audio.srcObject as MediaStream);
            const analyser = audioCtx.createAnalyser();

            analyser.fftSize = 256; // number of samples, adjust for resolution
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            console.log(dataArray)

            const update = () => {
                analyser.getByteFrequencyData(dataArray);
                // split frequency data for each bar (simple approach)
                const barLevels = [
                    dataArray[2], // low freq
                    dataArray[5], // mid freq
                    dataArray[10], // high freq
                ].map((n) => n / 255); // normalize 0-1

                setAudioLevels(barLevels);
                requestAnimationFrame(update);
            };

            update();
        } catch (err) {
            console.warn("Audio play failed:", err);
            setStatus("error");
            setError("Autoplay blocked. Tap to start audio.");
        }
    }, [audioRef]);

    useEffect(() => {
        unmounted.current = false;
        setError("");
        setStatus("connecting");

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        pc.onicecandidate = (e) => {
            if (!e.candidate) return;
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                    JSON.stringify({
                        type: "candidate",
                        candidate: e.candidate,
                    })
                );
            }
        };

        pc.ontrack = (event) => {
            const audio = audioRef.current;
            console.log("yo");
            if (!audio) return;
            console.log("got track");
            audio.srcObject = event.streams[0];
            attemptPlay();
        };

        pc.onconnectionstatechange = () => {
            if (
                pc.connectionState === "failed" ||
                pc.connectionState === "closed"
            ) {
                if (!unmounted.current) {
                    setStatus("error");
                    setError("WebRTC connection failed.");
                }
            }
        };

        ws.onopen = async () => {
            if (!unmounted.current) setStatus("connecting");

            try {
                pc.addTransceiver("audio", { direction: "recvonly" });
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                ws.send(
                    JSON.stringify({
                        type: "offer",
                        sdp: offer.sdp,
                    })
                );
            } catch (err) {
                console.error("Failed to create/send offer", err);
                setError("WebRTC offer failed");
                setStatus("error");
            }
        };

        ws.onerror = () => {
            if (!unmounted.current) {
                setError("WebSocket error");
                setStatus("error");
            }
        };

        ws.onclose = () => {
            if (!unmounted.current) {
                setError("WebSocket closed");
                setStatus("error");
            }
        };

        ws.onmessage = async (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "answer") {
                try {
                    console.log("got answer");
                    await pc.setRemoteDescription({
                        type: "answer",
                        sdp: msg.sdp,
                    });
                } catch (err) {
                    console.error("Failed to set remote answer", err);
                    setError("Failed to process server answer");
                    setStatus("error");
                }
            }

            if (msg.type === "candidate" && msg.candidate) {
                try {
                    await pc.addIceCandidate(msg.candidate);
                } catch (err) {
                    console.error("Failed to add ICE candidate", err);
                    setError("Failed to add ICE candidate");
                    setStatus("error");
                }
            }

            if (msg.type === "renegotiate") {
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(
                            JSON.stringify({
                                type: "offer",
                                sdp: offer.sdp,
                            })
                        );
                    }
                } catch (err) {
                    console.error("Failed to renegotiate", err);
                    setError("Failed to renegotiate");
                    setStatus("error");
                }
            }

            if (msg.type === "emoji") {
                setLatestReaction({ emoji: msg.emoji });
            }
        };

        return () => {
            unmounted.current = true;
            cleanup();
        };
    }, [WS_URL, audioRef, cleanup, attemptPlay]);

    const sendReaction = useCallback((emoji: string) => {
        const ws = wsRef.current;
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "emoji", emoji }));
        }
    }, []);

    const clearLatestReaction = useCallback(() => {
        setLatestReaction(null);
    }, []);

    const resumeAudio = useCallback(() => {
        attemptPlay();
    }, [attemptPlay]);

    return {
        status,
        isConnected: status === "connected",
        isConnecting: status === "connecting",
        error,
        sendReaction,
        latestReaction,
        clearLatestReaction,
        resumeAudio,
        audioLevels
    };
}
