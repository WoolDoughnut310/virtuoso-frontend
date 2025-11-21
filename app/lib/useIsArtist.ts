import { useOptionalCurrentUser } from "./useCurrentUser";

export function useIsArtist() {
    const user = useOptionalCurrentUser();

    return user && user.artist_id != null;
}