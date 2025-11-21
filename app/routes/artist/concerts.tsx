import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentArtistID } from "~/lib/useCurrentUser";
import { createConcertConcertsCreatePostMutation } from "~/client/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import type { ConcertPublic } from "~/client";
import { useArtistConcerts } from "~/lib/useArtistConcerts";
import ConcertListings from "~/components/ConcertListings";
import { artistOnlyLoader } from "~/lib/loaders";

export const clientLoader = artistOnlyLoader;

export default function ArtistDashboard() {
    const navigate = useNavigate();
    const artistId = useCurrentArtistID();
    const createConcert = useMutation({
        ...createConcertConcertsCreatePostMutation(),
        onSuccess: (data: ConcertPublic) => {
            navigate({ pathname: `/concert/${data.id}`, search: "?mode=edit" });
        },
    });

    const query = useArtistConcerts(artistId);

    const handleCreateConcert = useCallback(async () => {
        if (createConcert.isPending) return;
        createConcert.mutate({});
    }, []);

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    type="button"
                    onClick={handleCreateConcert}
                    disabled={createConcert.isPending}
                    className="bg-[#C39F45] hover:bg-[#A88C3E] hover:cursor-pointer text-white text-lg font-bold py-3 px-6 rounded-lg shadow-xl flex items-center absolute top-6 right-6"
                >
                    {createConcert.isPending ? (
                        "Creating Draft..."
                    ) : (
                        <>
                            <Plus className="mr-2 h-5 w-5" />
                            New Concert
                        </>
                    )}
                </button>
            </motion.div>

            <ConcertListings toEdit query={query} />
        </div>
    );
}
