import { Link, matchPath, useLocation, useParams } from "react-router";
import SearchBar from "./SearchBar";
import { useIsOwner } from "~/lib/useIsOwner";
import ViewEditToggle from "./ViewEditToggle";

export default function Header({ title }: { title?: string }) {
    const location = useLocation();
    const currentPath = location.pathname;
    const params = useParams();
    const isOwner = useIsOwner(params.concert_id);
    const links = {
        Home: "/",
        Discover: "/discover",
        Account: "/account",
    };

    return (
        <div className="flex flex-row px-16 py-8 border-b-4 border-b-[#ccac54] justify-between">
            <h1 className="font-bodoni-moda font-semibold text-6xl">
                {title || "Virtuoso"}
            </h1>
            {!title && (
                <div className="flex flex-row justify-center items-center gap-16 text-2xl font-ibm-plex-sans font-normal text-[#282828]">
                    {Object.entries(links).map(([name, path]) => {
                        const isActive = currentPath === path;

                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`hover:text-[#C39F45] focus:outline-none ${isActive ? "border-b-2 border-[#C39F45]" : ""}`}
                            >
                                {name}
                            </Link>
                        );
                    })}
                    {currentPath === links.Discover && <SearchBar />}
                </div>
            )}

            {matchPath("/concert/*", currentPath) && isOwner && (
                <ViewEditToggle />
            )}
        </div>
    );
}
