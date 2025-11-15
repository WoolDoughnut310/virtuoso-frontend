import { useSearchParams } from "react-router";

export function useIsEditing(): [boolean, (value: boolean) => void] {
    const [searchParams, setSearchParams] = useSearchParams();

    const isEditing = searchParams.get("mode") === "edit";
    const setIsEditing = (value: boolean) => {
        setSearchParams({ mode: value ? "edit" : "view" });
    };

    return [isEditing, setIsEditing];
}
