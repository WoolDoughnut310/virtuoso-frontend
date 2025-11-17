import ConcertDetail from "~/components/ConcertDetail";
import type { Route } from "./+types/concert";
import ConcertSkeleton from "~/components/ConcertSkeleton";
import { useConcertData } from "~/lib/useConcertData";
import { useIsOwner } from "~/lib/useIsOwner";

export default function Concert({ params }: Route.ComponentProps) {
    const concert_id = Number(params.concert_id);
    var { isPending, isError, data, error } = useConcertData(concert_id);

    const isOwner = useIsOwner(concert_id);

    if (isPending) return <ConcertSkeleton />;

    if ((isError && error) || !data)
        return <div>Error loading concert details: {error?.message}</div>;

    return (
        <ConcertDetail concert_id={concert_id} data={data} isOwner={isOwner} />
    );
}
