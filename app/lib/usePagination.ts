import { useCallback } from "react";
import { useSearchParams } from "react-router";

export function usePagination() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;
    const sortBy =
        (searchParams.get("sort_by") as "upcoming" | "popularity") ||
        "popularity";

    const artistIdString = searchParams.get("artist_id");
    const artistId = artistIdString ? Number(artistIdString) : null;

    const nextPage = useCallback(() => {
        setSearchParams({
            limit: String(limit),
            offset: String(offset + limit),
        });
    }, []);

    const prevPage = useCallback(() => {
        const limit = Number(searchParams.get("limit")) || 50;
        const offset = Number(searchParams.get("offset")) || 0;
        setSearchParams({
            limit: String(limit),
            offset: String(Math.max(0, offset - limit)),
        });
    }, []);

    return { q, limit, offset, sortBy, artistId, nextPage, prevPage };
}
