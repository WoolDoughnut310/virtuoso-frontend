import { useQuery } from "@tanstack/react-query";
import { readUsersMeMeGetOptions } from "~/client/@tanstack/react-query.gen";

export const useCurrentUserQuery = () => {
    return useQuery({
        ...readUsersMeMeGetOptions(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
