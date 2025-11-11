import { Skeleton } from "./ui/skeleton";

export default function ConcertSkeleton() {
    return (
        <div className="overflow-y-scroll">
            <div className="flex flex-row min-h-[calc(100vh-132px)] px-16 py-[75px]">
                <div className="flex basis-3/5 pr-8 border-r-2 border-[#C39F45]/80">
                    <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <div className="flex basis-2/5 flex-col justify-start items-end py-4">
                    <Skeleton className="w-[500px] h-14 rounded-sm" />
                    <Skeleton className="w-96 h-7 rounded-sm mt-1" />
                    <div className="flex flex-col justify-center items-center bg-[#F2F2F2] gap-8 w-72 rounded-4xl py-4 mt-16">
                        <Skeleton className="w-14 h-7 rounded-sm" />
                        <div className="flex flex-col justify-center items-center gap-5">
                            <Skeleton className="w-40 h-5 rounded-sm" />
                            <Skeleton className="w-52 h-5 rounded-sm" />
                        </div>
                    </div>
                    <Skeleton className="mt-5 rounded-2xl w-72 h-16" />
                </div>
            </div>
            <div className="flex flex-col px-48 py-16 gap-3">
                <h4 className="font-playfair-display text-[#c39f45] font-medium text-2xl uppercase">
                    The Story
                </h4>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full rounded-sm" />
                    <Skeleton className="h-4 w-full rounded-sm" />
                    <Skeleton className="h-4 w-full rounded-sm" />
                    <Skeleton className="h-4 w-3/4 rounded-sm" />
                </div>
            </div>
        </div>
    );
}