import WebRTCAudio from "~/components/WebRTCAudio";

export default function Home() {
    const onClick = async () => {
        try {
            const response = await fetch("http://localhost:8000/concerts/start", { method: "POST" });
            console.log("got", response);
        } catch (e: any) {
            console.error("error", e)
        }

    };

    return (
        <div className="p-3">
            <WebRTCAudio />
            <button
                onClick={onClick}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition duration-150 font-medium select-none"
            >
                Click to Start
            </button>
        </div>
    );
}
