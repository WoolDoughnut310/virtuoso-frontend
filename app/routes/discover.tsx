import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { discoverConcertsConcertsDiscoverGetOptions } from "~/client/@tanstack/react-query.gen";
import ConcertListing from "~/components/ConcertListing";

export default function Discover() {
    const [searchParams, setSearchParams] = useSearchParams();
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;
    const sortBy =
        (searchParams.get("sort_by") as "upcoming" | "popularity") ||
        "popularity";

    const { isPending, isError, error, data, isFetching, isPlaceholderData } =
        useQuery({
            ...discoverConcertsConcertsDiscoverGetOptions({
                query: { limit, offset, sort_by: sortBy },
            }),
            placeholderData: keepPreviousData,
        });

    const nextPage = () => {
        setSearchParams({
            limit: String(limit),
            offset: String(offset + limit),
        });
    };

    const prevPage = () => {
        const limit = Number(searchParams.get("limit")) || 50;
        const offset = Number(searchParams.get("offset")) || 0;
        setSearchParams({
            limit: String(limit),
            offset: String(Math.max(0, offset - limit)),
        });
    };

    return (
        <div className="flex flex-col justify-center grow">
            <div className="overflow-auto grow pb-12">
                {isPending ? (
                    <div>Loading...</div>
                ) : isError ? (
                    <div>Error: {error.message}</div>
                ) : (
                    <div className="flex flex-row gap-4 flex-wrap p-8">
                        {data.items.map((concert) => (
                            <ConcertListing key={concert.id} data={concert} />
                        ))}
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 flex flex-row w-full justify-end items-center py-4 gap-4 px-12">
                <button
                    type="button"
                    onClick={prevPage}
                    disabled={offset === 0}
                    className={`px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${offset === 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#ccac54] text-white shadow-md hover:bg-[#b89545] hover:cursor-pointer"}`}
                >
                    Previous Page
                </button>
                <button
                    type="button"
                    onClick={nextPage}
                    disabled={isPlaceholderData || isFetching || !data?.hasMore}
                    className={`
        px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105
        ${
            isPlaceholderData || isFetching || !data?.hasMore
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#ccac54] text-white shadow-md hover:bg-[#b89545] hover:cursor-pointer"
        }
        `}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
}
