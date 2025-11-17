import { useAuth } from "./AuthContext";
import { useConcertData } from "./useConcertData";

export function useIsOwner(concert_id?: number | string) {
    var { data } = useConcertData(concert_id);
    const { user, isAuthenticated } = useAuth();

    return isAuthenticated && user?.artist_id === data?.artist.id;
}
