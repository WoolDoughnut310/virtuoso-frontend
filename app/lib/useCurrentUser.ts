import { useQuery } from "@tanstack/react-query";
import { currentUserQuery } from "./queries";

export const useCurrentUser = () => {
    return useQuery({ ...currentUserQuery(), throwOnError: true }).data!;
};

export const useOptionalCurrentUser = () => {
    return useQuery(currentUserQuery()).data;
};

export const useCurrentArtistID = () => {
    const user = useCurrentUser();
    return user.artist_id!;
}