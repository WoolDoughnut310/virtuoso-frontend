import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { startConcertConcertsStartPostMutation } from "~/client/@tanstack/react-query.gen";
import useWebRTCAudio from "~/util/useWebRTCAudio";

export default function Home() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const {start: startStream, isLoading: streamLoading} = useWebRTCAudio(audioRef);
    const startConcert = useMutation({
        ...startConcertConcertsStartPostMutation(),
        onSuccess: async (data) => {
            console.log("success", data);
            startStream();
        },
        onError: (error) => {
            console.log("got error:", error);
        }
    });

    return (
        <div className="p-3">
            <audio ref={audioRef} controls />
            {startConcert.isPending && <p>Pending request...</p>}
            {streamLoading && <p>Loading stream...</p>}
            <button
                onClick={() => startConcert.mutate({})}
                type="button"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition duration-150 font-medium select-none"
            >
                Click to Start
            </button>
        </div>
    );
}
