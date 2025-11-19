import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { discoverConcertsConcertsDiscoverGetOptions } from "~/client/@tanstack/react-query.gen";

export function useArtistConcerts(artist_id: number | string) {
    const [searchParams, _] = useSearchParams();
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;

    return useQuery({
        ...discoverConcertsConcertsDiscoverGetOptions({
            query: { artist_id: Number(artist_id), limit, offset },
        }),
        placeholderData: keepPreviousData,
        enabled: !!artist_id,
    });
}
