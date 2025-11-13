import { useEffect } from "react";
import ConcertDetail from "~/components/ConcertDetail";
import type { Route } from "./+types/concert";
import { useQuery } from "@tanstack/react-query";
import { getConcertConcertsConcertIdGetOptions } from "~/client/@tanstack/react-query.gen";
import { useSearchParams } from "react-router";
import ConcertSkeleton from "~/components/ConcertSkeleton";
import { useLayoutContext } from "~/components/LayoutProvider";
import ViewEditToggle from "~/components/ViewEditToggle";

export default function Concert({ params }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const isEditing = searchParams.get("mode") === "edit";
    const concert_id = Number(params.concert_id);
    var { isPending, isError, data, error } = useQuery({
        ...getConcertConcertsConcertIdGetOptions({
            path: {
                concert_id,
            },
        }),
    });
    const { setAdminControls } = useLayoutContext();

    const setIsEditing = (value: boolean) => {
        setSearchParams({ mode: value ? "edit" : "view" });
    }

    
    const isOwner = true;
    
    useEffect(() => {
        const toggleComponent = <ViewEditToggle isEditing={isEditing} setIsEditing={setIsEditing} />;

        if (isOwner) {
            setAdminControls(toggleComponent);
        } else {
            setAdminControls(null);
        }

        return () => setAdminControls(null);
    }, [setAdminControls, isEditing]);

    if (isPending) return <ConcertSkeleton />;

    if ((isError && error) || !data)
        return <div>Error loading concert details: {error?.message}</div>;

    return (
        <ConcertDetail
            concert_id={concert_id}
            data={data}
            isOwner={isOwner}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        />
    );
}
