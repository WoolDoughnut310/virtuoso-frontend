export default function Media() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 transition duration-300 hover:shadow-[0_20px_25px_-5px_rgba(204,172,84,0.1),0_10px_10px_-5px_rgba(204,172,84,0.04)]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-[#282828] font-ibm-plex-sans">
                        Symphony No. 5 in C Minor
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="w-4 h-4 mr-1 text-[#ccac54]"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>3:30</span>
                        <span className="mx-2">•</span>
                        <span>ID: 1001</span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        className="p-3 bg-red-700 text-white rounded-full hover:bg-red-800 transition duration-150 shadow-lg focus:outline-none"
                        title="Delete Asset"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>

                    <div className="absolute right-0 top-0 mt-12 w-80 bg-white p-4 rounded-xl shadow-2xl border-2 border-red-200 z-10 hidden">
                        <p className="text-sm font-semibold text-gray-800 mb-3">
                            Are you sure you want to delete this asset?
                        </p>
                        <div className="flex space-x-2">
                            <button className="flex-1 text-[#282828] border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
                                Cancel
                            </button>
                            <button className="flex-1 text-white font-semibold py-2 rounded-lg bg-red-700 hover:bg-red-800 transition">
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-700 border-t border-b border-gray-100 py-3 mb-4">
                <div className="flex items-center space-x-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="w-4 h-4 text-[#ccac54]"
                    >
                        <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                        />
                        <line x1="8" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="16" y2="21" />
                    </svg>
                    <span className="font-medium">Codec:</span>
                    <span className="font-bold">FLAC</span>
                </div>
                <div className="flex items-center space-x-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="w-4 h-4 text-[#ccac54]"
                    >
                        <path d="M9 18V5l-4 4" />
                        <path d="M15 18V5l4 4" />
                    </svg>
                    <span className="font-medium">Bitrate:</span>
                    <span>1411 kbps</span>
                </div>
                <div className="flex items-center space-x-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="w-4 h-4 text-[#ccac54]"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    </svg>
                    <span className="font-medium">Channels:</span>
                    <span>Stereo</span>
                </div>
            </div>

            <div className="w-full">
                <audio controls className="w-full h-12">
                    <source src="mock_audio_url.flac" type="audio/flac" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}
