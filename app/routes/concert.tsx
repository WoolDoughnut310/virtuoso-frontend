import { useEffect, useState } from "react";
import ConcertView from "~/components/ConcertView";
import ConcertEditor from "~/components/ConcertEditor";
import type { Route } from "./+types/concert";
import { useQuery } from "@tanstack/react-query";
import { getConcertConcertsConcertIdGetOptions } from "~/client/@tanstack/react-query.gen";
import { useSearchParams } from "react-router";
import ConcertSkeleton from "~/components/ConcertSkeleton";
import { useLayoutContext } from "~/components/LayoutProvider";
import ViewEditToggle from "~/components/ViewEditToggle";

export default function Concert({ params }: Route.ComponentProps) {
    const [searchParams, _] = useSearchParams();
    const editing = searchParams.get("mode") === "edit";
    const { isPending, isError, data, error } = useQuery({
        ...getConcertConcertsConcertIdGetOptions({
            path: {
                concert_id: Number(params.concert_id),
            },
        }),
    });
    const { setAdminControls } = useLayoutContext();

    const toggleComponent = <ViewEditToggle />;

    const isOwner = true;

    useEffect(() => {
        if (isOwner) {
            setAdminControls(toggleComponent);
        } else {
            setAdminControls(null);
        }

        return () => setAdminControls(null);
    }, [setAdminControls]);

    if (isPending) return <ConcertSkeleton />;

    if (!isOwner) return <ConcertView data={data} />;

    if (editing) {
        return <ConcertEditor data={data} />;
    }

    return <ConcertView data={data} />;
}
