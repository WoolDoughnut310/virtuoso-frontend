import { useOptionalConcertData } from "./useConcertData";
import { useOptionalCurrentUser } from "./useCurrentUser";

export function useIsOwner(concert_id?: number | string) {
    const concert = useOptionalConcertData(concert_id);
    const user = useOptionalCurrentUser();

    return user && user.artist_id == concert?.artist.id;
}
