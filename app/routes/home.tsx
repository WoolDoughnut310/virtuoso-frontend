// import { useMutation } from "@tanstack/react-query";
// import { useRef, type ChangeEvent } from "react";
// import {
// 	startConcertConcertsStartPostMutation,
// 	uploadFileConcertsUploadPostMutation,
// } from "~/client/@tanstack/react-query.gen";
// import useWebRTCAudio from "~/lib/useWebRTCAudio";

// export default function Home() {
// 	const fileInputRef = useRef<HTMLInputElement | null>(null);
// 	const audioRef = useRef<HTMLAudioElement | null>(null);
// 	const { start: startStream, isLoading: streamLoading } =
// 		useWebRTCAudio(audioRef);
// 	const startConcert = useMutation({
// 		...startConcertConcertsStartPostMutation(),
// 		onSuccess: async (data) => {
// 			console.log("success", data);
// 			startStream();
// 		},
// 		onError: (error) => {
// 			console.log("got error:", error);
// 		},
// 	});
// 	const uploadFileToConcert = useMutation({
// 		...uploadFileConcertsUploadPostMutation(),
// 		onSuccess: async (data) => {
// 			console.log("success", data);
//             if (fileInputRef.current) fileInputRef.current.value = "";
// 		},
// 		onError: (error) => {
// 			console.log("got error:", error);
//             if (fileInputRef.current) fileInputRef.current.value = "";
// 		},
// 	});

// 	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
// 		const file = event.target.files?.[0];
// 		if (!file) return;
        
// 		uploadFileToConcert.mutate({
// 			body: { file },
// 		});
// 	};

//     const handleButtonClick = () => {
//     fileInputRef.current?.click();
//   };

// 	return (
// 		<div className="p-3">
// 			<audio ref={audioRef} controls />
// 			{startConcert.isPending && <p>Pending request...</p>}
// 			{streamLoading && <p>Loading stream...</p>}
// 			{uploadFileToConcert.isPending && <p>Upload pending...</p>}
// 			<button
// 				onClick={() => startConcert.mutate({})}
// 				type="button"
// 				className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition duration-150 font-medium select-none"
// 			>
// 				Click to Start
// 			</button>
// 			<input
// 				type="file"
// 				ref={fileInputRef}
// 				className="hidden"
// 				onChange={handleFileChange}
// 			/>
//             <button type="button" onClick={handleButtonClick} disabled={uploadFileToConcert.isPending} className={`
//           px-4 py-2 rounded-md font-medium transition-all
//           bg-blue-600 text-white shadow
//           hover:bg-blue-700 hover:shadow-md
//           disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed
//         `}>
//         {uploadFileToConcert.isPending ? "Uploading..." : "Upload File"}
//       </button>
// 		</div>
// 	);
// }

export default function Home() {
	return <div>this is home.</div>
}