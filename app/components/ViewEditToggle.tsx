import { useSearchParams } from "react-router";

export default function ViewEditToggle() {
    const [searchParams, setSearchParams] = useSearchParams();
    const editing = searchParams.get("mode") === "edit";

    const baseClasses = "h-full w-1/2 flex items-center justify-center transition-colors duration-200";
    const inactiveClasses = "bg-transparent text-[#282828]";

    return (
        <div className="flex flex-row cursor-pointer w-40 h-12 rounded-lg border border-[#e0e0e0] justify-around items-center text-lg overflow-hidden">
            <span
                onClick={() => setSearchParams({ mode: "view" })}
                className={`${baseClasses} ${!editing ? "bg-[#C39F45] text-white" : inactiveClasses}`}
            >
                View
            </span>
            <span
                onClick={() => setSearchParams({ mode: "edit" })}
                className={`${baseClasses} ${editing ? "bg-[#C39F45] text-white" : inactiveClasses}`}
            >
                Edit
            </span>
        </div>
    );
}
