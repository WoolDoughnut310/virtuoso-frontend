import type { UseQueryResult } from "@tanstack/react-query";
import type { PaginatedConcerts } from "~/client";
import { Skeleton } from "./ui/skeleton";
import ConcertListing from "./ConcertListing";
import { usePagination } from "~/lib/usePagination";

export default function ConcertListings({
    query,
    toEdit,
}: {
    query: UseQueryResult<PaginatedConcerts, Error>;
    toEdit?: boolean;
}) {
    const { offset, nextPage, prevPage } = usePagination();

    const { isPending, isError, error, data, isFetching, isPlaceholderData } =
        query;

    return (
        <div className="flex flex-col justify-center grow">
            <div className="overflow-auto pb-12 grow">
                <div className="flex flex-row gap-4 flex-wrap p-8">
                    {isPending ? (
                        [...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden w-[540px]"
                            >
                                {/* Image Skeleton */}
                                <Skeleton className="h-60 w-full bg-gray-700" />

                                {/* Bottom Content */}
                                <div className="p-4 flex flex-col gap-3">
                                    {/* Title */}
                                    <Skeleton className="h-5 w-3/4 bg-gray-700 rounded" />

                                    {/* Subtitle */}
                                    <Skeleton className="h-4 w-1/2 bg-gray-700 rounded" />

                                    {/* Metadata Row */}
                                    <div className="flex flex-row justify-between mt-2">
                                        {/* Left side icons (date + attendance) */}
                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-4 w-20 bg-gray-700 rounded" />
                                            <Skeleton className="h-4 w-24 bg-gray-700 rounded" />
                                        </div>

                                        {/* Price */}
                                        <Skeleton className="h-4 w-16 bg-gray-700 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : data && data.items.length > 0 ? (
                        data.items.map((concert) => (
                            <ConcertListing
                                key={concert.id}
                                data={concert}
                                toEdit={toEdit}
                            />
                        ))
                    ) : (
                        <div className="text-center p-12 border border-dashed border-gray-700 rounded-lg text-gray-500">
                            {isError ? (
                                <p className="text-red-400">
                                    Error loading your concerts. Please check
                                    the network connection and try again.
                                    <br />
                                    {error.message}
                                </p>
                            ) : (
                                <>
                                    <h3 className="text-xl mb-2">
                                        No Concerts Found
                                    </h3>
                                    {toEdit && (
                                        <p>
                                            Click "New Concert" to start
                                            planning your next live event!
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
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
