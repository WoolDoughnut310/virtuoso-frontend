import {
    getConcertConcertsConcertIdGetOptions,
    readUsersMeMeGetOptions,
} from "~/client/@tanstack/react-query.gen";

export const currentUserQuery = () => {
    return {
        ...readUsersMeMeGetOptions(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    };
};

export const concertDataQuery = (concert_id?: string | number | null) => {
    return {
        ...getConcertConcertsConcertIdGetOptions({
            path: {
                concert_id: Number(concert_id),
            },
        }),
        enabled: !!concert_id,
    };
};
