import { Clock } from "lucide-react";
import type { ConcertPublic } from "~/client";
import { formatUpcoming } from "~/lib/formatDateTime";

export interface ConcertDetailProps {
    data: ConcertPublic;
    isOwner: boolean;
    isEditing: boolean;
}

export default function ConcertDetail({ data, isOwner, isEditing }: ConcertDetailProps) {
    return (
        <div className="overflow-y-scroll">
            <div className="flex flex-row min-h-[calc(100vh-132px)] px-16 py-[75px]">
                <div className="flex basis-3/5 pr-8 border-r-2 border-[#C39F45]/80">
                    <div className="w-full h-full bg-red-500 flex justify-center items-center">
                        <h1 className="text-8xl">INSERT HERO IMAGE</h1>
                    </div>
                </div>
                <div className="flex basis-2/5 flex-col justify-start items-end py-4">
                    <h2 className="text-5xl font-medium font-playfair-display uppercase ">
                        {data.artist.name}
                    </h2>
                    <h3 className="text-2xl font-normal font-ibm-plex-sans">
                        {data.name}
                    </h3>
                    <div className="flex flex-col justify-center items-center bg-[#F2F2F2] gap-8 w-72 rounded-4xl py-4 mt-16">
                        <span className="text-2xl font-ibm-plex-sans bg-linear-to-b from-[#e0c279] to-[#a67c00] bg-clip-text text-transparent">
                            ${data.ticket_price}
                        </span>
                        <div className="flex flex-col justify-center items-center gap-5 text-lg font-ibm-plex-sans text-[#282828]">
                            <span className="small-caps">
                                Sold 35 / {data.max_capacity}
                            </span>
                            <div className="flex flex-row gap-2">
                                <Clock size={24} />
                                {formatUpcoming(data.start_time)}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="mt-5 hover:cursor-pointer transition transform hover:scale-105 rounded-2xl shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] w-72 font-semibold flex justify-center items-center text-white font-playfair-display text-4xl px-3 py-10 bg-[#ccac54FF] hover:bg-[#c39f45]"
                    >
                        Buy Access
                    </button>
                </div>
            </div>
            <div className="flex flex-col px-48 py-16 gap-3">
                <h4 className="font-playfair-display text-[#c39f45] font-medium text-2xl uppercase">
                    The Story
                </h4>
                <p className="text-[#282828] text-lg leading-normal font-normal">
                    {data.description || `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.`}
                </p>
            </div>
        </div>
    );
}
