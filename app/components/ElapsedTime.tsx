import React, { useState, useEffect } from "react";

interface ElapsedTimeProps {
    startTimeISO: string;
}

const formatTime = (ms: number): string => {
    if (ms < 0) ms = 0;

    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    const pad = (num: number): string => String(num).padStart(2, "0");

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
};

export const ElapsedTime: React.FC<ElapsedTimeProps> = ({ startTimeISO }) => {
    const startTime = new Date(startTimeISO).getTime();

    const initialElapsed = Date.now() - startTime;

    const [elapsedMs, setElapsedMs] = useState(initialElapsed);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setElapsedMs(Date.now() - startTime);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    return (
        <span className="text-gray-300 text-lg font-mono">
            {formatTime(elapsedMs)}
        </span>
    );
};
