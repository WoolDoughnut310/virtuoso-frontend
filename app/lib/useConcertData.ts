import { useQuery } from "@tanstack/react-query";
import { getConcertConcertsConcertIdGetOptions } from "~/client/@tanstack/react-query.gen";

export function useConcertQuery(concert_id?: number | string) {
    return useQuery({
        ...getConcertConcertsConcertIdGetOptions({
            path: {
                concert_id: Number(concert_id),
            },
        }),
        enabled: !!concert_id
    });
}
