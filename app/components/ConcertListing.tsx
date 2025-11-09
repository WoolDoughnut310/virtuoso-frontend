import type { ConcertPublic } from "~/client";
import { Banknote, Clock, Users } from "lucide-react";
import { formatUpcoming } from "~/lib/formatDateTime";

export default function ConcertDisplay({ data }: { data: ConcertPublic }) {
    return (
        <div className="flex flex-col w-lg ">
            <div className="rounded-t-3xl bg-red-500 h-72"></div>
            <div className="flex flex-row rounded-b-3xl px-6 py-6 justify-between items-center border-2 border-black">
                <div className="flex flex-col gap-px">
                    <h3 className="font-ibm-plex-sans font-medium text-[18px]">
                        {data.name}
                    </h3>
                    <h4 className="font-ibm-plex-sans font-normal text-[14px] text-stone-800">
                        - Featuring <i>{data.artist.name}</i>
                    </h4>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex flex-row items-center gap-2 justify-start">
                        <Clock size={16} />
                        <span className="text-md font-source-sans-pro font-light">
                            {formatUpcoming(data.start_time)}
                        </span>
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-start">
                        <Users size={16} />
                        <span className="text-md font-source-sans-pro font-light">
                            23 / {data.max_capacity}
                        </span>
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-start">
                        <svg className="w-0 h-0">
                            <defs>
                                <linearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#e0c279"
                                        stopOpacity="1"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#a67c00"
                                        stopOpacity="1"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                        <Banknote
                            stroke="url(#grad)"
                            fill="none"
                            size={20}
                            className="-ml-2.5"
                        />
                        <span className="bg-linear-to-b from-[#e0c279] to-[#a67c00] bg-clip-text text-transparent text-md font-normal font-source-sans-pro">
                            ${data.ticket_price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
