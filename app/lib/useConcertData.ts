import { useQuery } from "@tanstack/react-query";
import { concertDataQuery } from "./queries";

export function useConcertData(concert_id: number | string) {
    return useQuery({ ...concertDataQuery(concert_id), throwOnError: true })
        .data!;
}

export function useOptionalConcertData(concert_id?: number | string) {
    return useQuery(concertDataQuery(concert_id)).data;
}
