import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { discoverConcertsConcertsDiscoverGetOptions } from "~/client/@tanstack/react-query.gen";
import ConcertListings from "~/components/ConcertListings";
import { usePagination } from "~/lib/usePagination";

export default function Discover() {
    const { q, limit, offset, sortBy } = usePagination();
    const query = useQuery({
        ...discoverConcertsConcertsDiscoverGetOptions({
            query: { limit, offset, sort_by: sortBy, q },
        }),
        placeholderData: keepPreviousData,
    });

    return (
        <>
            <title>Discover Concerts</title>
            <ConcertListings query={query} />
        </>
    );
}
