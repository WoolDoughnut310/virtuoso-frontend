import { useConcertData } from "./useConcertData";
import { useEffect, useState } from "react";

export function useIsLive(concert_id: string | number) {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const data = useConcertData(concert_id);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (!data.start_time) return false;

    const startTime = new Date(data.start_time).getTime();
    const endTime = startTime + 3 * 60 * 60 * 1000;

    return currentTime >= startTime && currentTime < endTime;
}
