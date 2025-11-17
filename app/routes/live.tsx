import { useConcertData } from "~/lib/useConcertData";
import type { Route } from "./+types/live";
import HeroImage from "~/components/HeroImage";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { ElapsedTime } from "~/components/ElapsedTime";
import { Skeleton } from "~/components/ui/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useWebRTCAudio from "~/lib/useWebRTCAudio";

export interface FloatingEmoji {
    id: number;
    emoji: string;
    startLeft: number;
    duration: number;
    driftX: number;
    rotate: number;
}

const EMOJIS: string[] = ["❤️", "😂", "🔥", "🎉", "👏", "😎"];

export default function Live({ params }: Route.ComponentProps) {
    const concert_id = Number(params.concert_id);
    var { isPending, isError, data, error } = useConcertData(concert_id);
    const [volume, setVolume] = useState(75);
    const [isMuted, setIsMuted] = useState(false);
    const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const {
        status: streamStatus,
        error: streamError,
        sendReaction,
        latestReaction,
        clearLatestReaction,
        resumeAudio,
        audioLevels
    } = useWebRTCAudio(audioRef, concert_id);

    const isLoading = isPending || streamStatus === "connecting";
    const isPlaying = streamStatus === "connected";
    let hasError = (isError && error) || streamStatus === "error";

    useEffect(() => {
        const audioEl = audioRef.current;
        if (audioEl) {
            // Set the volume (value is 0.0 to 1.0)
            audioEl.volume = volume / 100;

            // Set the muted state
            audioEl.muted = isMuted;
        }
    }, [volume, isMuted]);

    const triggerLocalAnimation = useCallback((emoji: string) => {
        const id = Date.now() + Math.random();
        const startLeft = Math.random() * 20 + 70;
        const duration = 3 + Math.random() * 2;
        const driftX = (Math.random() - 0.5) * 80;
        const rotate = Math.random() > 0.5 ? 360 : -360;

        const newEmoji: FloatingEmoji = {
            id,
            emoji,
            startLeft,
            duration,
            driftX,
            rotate,
        };
        setEmojis((prev) => [...prev, newEmoji]);
        setTimeout(() => {
            setEmojis((prev) => prev.filter((e) => e.id !== id));
        }, duration * 1000);
    }, []);

    const handleLocalReaction = useCallback(
        (emoji: string) => {
            triggerLocalAnimation(emoji);
            sendReaction(emoji);
        },
        [sendReaction, triggerLocalAnimation]
    );

    useEffect(() => {
        if (latestReaction) {
            triggerLocalAnimation(latestReaction.emoji);
            clearLatestReaction();
        }
    }, [latestReaction, triggerLocalAnimation, clearLatestReaction]);

    const handleVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVolume = Number(e.target.value);
            setVolume(newVolume);

            if (newVolume > 0 && isMuted) {
                setIsMuted(false);
            }
        },
        [isMuted]
    );

    const handleMuteToggle = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    const currentVolume = isMuted ? 0 : volume;
    const VolumeIcon =
        currentVolume === 0 ? VolumeX : currentVolume < 50 ? Volume1 : Volume2;

    // Inside Live.tsx, add this block before your main return statement
    let isAutoplayBlocked = streamError.includes("Autoplay blocked");

    return (
        <>
            Status: {streamStatus}
            <audio ref={audioRef} style={{ display: "none" }} />
            {hasError ? (
                isAutoplayBlocked ? (
                    <div className="flex flex-col items-center justify-center w-full h-screen bg-black/90 text-white">
                        <p className="mb-4 text-lg">
                            Browser requires a tap to start the live stream.
                        </p>
                        <motion.button
                            onClick={resumeAudio}
                            className="px-8 py-4 text-2xl font-bold bg-[#C39F45] text-black rounded-full shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ▶️ Start Audio
                        </motion.button>
                    </div>
                ) : (
                    <div className="p-10 text-white bg-red-800">
                        Error loading stream:{" "}
                        {error?.message ||
                            streamError ||
                            "Unknown connection error."}
                    </div>
                )
            ) : (
                <div className="relative w-full h-full overflow-hidden">
                    <HeroImage
                        src={isPending ? undefined : data?.cover_image_url}
                        className={`object-cover w-full h-full ${isPending ? "bg-gray-900/70" : ""}`}
                        alt="Live Concert Background"
                    />
                    <div className="absolute inset-0 bg-black/50 p-10 flex flex-col justify-between">
                        {emojis.map((e) => {
                            const {
                                id,
                                emoji,
                                startLeft,
                                duration,
                                driftX,
                                rotate,
                            } = e;
                            return (
                                <motion.span
                                    key={id}
                                    // Class names to ensure it floats on top and doesn't interfere with clicks
                                    className="absolute bottom-0 pointer-events-none select-none z-50"
                                    style={{
                                        left: `${startLeft}%`,
                                        fontSize: `${1.5 + Math.random()}rem`,
                                        // Start above the control bar (~50px)
                                        bottom: "50px",
                                    }}
                                    initial={{
                                        opacity: 0,
                                        y: 0,
                                        x: 0,
                                        scale: 0.8,
                                        rotate: 0,
                                    }}
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        y: -300 - Math.random() * 100, // float height
                                        x: [0, driftX / 2, driftX],
                                        rotate: [0, rotate],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: duration,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {emoji}
                                </motion.span>
                            );
                        })}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase animate-pulse">
                                    LIVE NOW
                                </span>

                                {isPending ? (
                                    <Skeleton className="h-6 w-28" />
                                ) : (
                                    <span className="text-white/80 text-sm font-ibm-plex-sans tracking-wider">
                                        1,850 LISTENING
                                    </span>
                                )}
                            </div>

                            {isPending ? (
                                <Skeleton className="h-12 w-64 mt-2" />
                            ) : (
                                <h1 className="text-6xl font-playfair-display text-white">
                                    {data?.artist.name}
                                </h1>
                            )}

                            {isPending ? (
                                <Skeleton className="h-8 w-48 mt-6" />
                            ) : (
                                <h2 className="text-3xl font-ibm-plex-sans text-gray-300 mt-2">
                                    {data?.name}
                                </h2>
                            )}
                        </div>

                        <div className="h-10 flex justify-center items-end space-x-1">
                            {isLoading
                                ? [...Array(5)].map((_, index) => (
                                      <div
                                          key={index}
                                          className="w-2 rounded-full bg-[#C39F45]"
                                          style={{
                                              height: "4px",
                                              animation:
                                                  "stream-load 1.2s infinite ease-in-out alternate",
                                              animationDelay: `${index * 0.1}s`,
                                              minHeight: "4px",
                                          }}
                                      />
                                  ))
                                : audioLevels.map((level, i) => (
                                      <div
                                          key={i}
                                          className="w-1 bg-[#C39F45]"
                                          style={{ height: `${level * 100}%` }}
                                      />
                                  ))}
                            <style>
                                {`
                    @keyframes stream-load {
                        0% {
                            transform: scaleY(1);
                            opacity: 0.5;
                            }
                            50% {
                                transform: scaleY(10); /* Grows 10x taller */
                                opacity: 1;
                                }
                                100% {
                                    transform: scaleY(1);
                                    opacity: 0.5;
                                    }
                    }
                    `}
                            </style>
                        </div>

                        <div className="flex justify-between items-center bg-black/70 p-4 rounded-lg">
                            {isPending ? (
                                <Skeleton className="h-6 w-16" />
                            ) : (
                                <ElapsedTime startTimeISO={data!.start_time!} />
                            )}

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleMuteToggle}
                                    className="text-[#C39F45] hover:text-[#A88C3E] hover:cursor-pointer"
                                >
                                    <VolumeIcon size={24} />
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1 accent-[#C39F45]"
                                    style={{ opacity: isMuted ? 0.5 : 1 }}
                                />
                            </div>
                            <div className="flex space-x-2">
                                {EMOJIS.map((e) => (
                                    <motion.button
                                        key={e}
                                        onClick={() => handleLocalReaction(e)}
                                        className="text-xl p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/70 transition-colors shadow-lg active:scale-95 transform hover:cursor-pointer"
                                        title={`Send ${e} reaction`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {e}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
