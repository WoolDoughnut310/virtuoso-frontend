import {
    Link,
    matchPath,
    useLocation,
    useNavigate,
    useParams,
} from "react-router";
import SearchBar from "./SearchBar";
import { useIsOwner } from "~/lib/useIsOwner";
import ViewEditToggle from "./ViewEditToggle";
import { Briefcase, Compass } from "lucide-react";
import { useIsArtist } from "~/lib/useIsArtist";
import { useOptionalCurrentUser } from "~/lib/useCurrentUser";
import { pick } from "~/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { useCallback } from "react";

const ALL_LINKS = {
    Home: "/",
    Discover: "/discover",
    Account: "/account",
    Concerts: "/artist/concerts",
    Media: "/artist/media",
    // Analytics: "/artist/analytics",
    Profile: "/artist/profile",
    Earnings: "/artist/earnings",
    Login: "/login",
    Register: "/register",
};

const ARTIST_LINKS = pick(ALL_LINKS, [
    "Concerts",
    "Media",
    "Profile",
    "Earnings",
]);
const FAN_LINKS = pick(ALL_LINKS, ["Home", "Discover", "Account"]);
const GUEST_LINKS = pick(ALL_LINKS, ["Login", "Register"]);

export default function Header({ title }: { title?: string }) {
    const location = useLocation();
    const currentPath = location.pathname;
    const params = useParams();
    const isOwner = useIsOwner(params.concert_id);
    const isArtist = useIsArtist();
    const user = useOptionalCurrentUser();
    const forArtist = currentPath.startsWith("/artist");
    const links = forArtist ? ARTIST_LINKS : !!user ? FAN_LINKS : GUEST_LINKS;
    const navigate = useNavigate();

    const switchView = useCallback(() => {
        if (!isArtist) return;
        if (forArtist) {
            navigate(ALL_LINKS.Discover);
        } else {
            navigate(ALL_LINKS.Concerts);
        }
    }, [navigate, isArtist, forArtist]);

    return (
        <div className="flex flex-row px-16 py-8 border-b-4 border-b-[#ccac54] justify-around items-center">
            <h1 className="font-bodoni-moda font-semibold text-6xl">
                {title || "Virtuoso"}
            </h1>
            {!title && (
                <div
                    className={`flex flex-row justify-center items-center ${forArtist ? "gap-14" : "gap-12"} text-2xl font-ibm-plex-sans font-normal text-[#282828]`}
                >
                    {Object.entries(links).map(([name, path]) => {
                        const isActive = currentPath === path;

                        const isEarnings =
                            "Earnings" in links && name == "Earnings";

                        return (
                            <Fragment key={path}>
                                {isEarnings && (
                                    <div className="w-0.5 h-14 bg-[#282828] -mx-7" />
                                )}
                                <Link
                                    to={path}
                                    className={`hover:text-[#C39F45] focus:outline-none ${isEarnings ? "relative" : ""} ${isActive ? "border-b-2 border-[#C39F45]" : ""}`}
                                >
                                    {name}
                                    {isEarnings && (
                                        <div className="bg-red-500 rounded-full text-xs p-1 w-6 h-6 text-center text-white absolute -right-6 -top-2">
                                            22
                                        </div>
                                    )}
                                </Link>
                            </Fragment>
                        );
                    })}
                    {"Discover" in links && currentPath === links.Discover && (
                        <SearchBar />
                    )}
                </div>
            )}

            {matchPath("/concert/*", currentPath) && isOwner && (
                <ViewEditToggle />
            )}

            {isArtist && (
                <button
                    type="button"
                    onClick={switchView}
                    className="text-white text-lg font-ibm-plex-sans p-5 flex flex-row gap-5 items-center bg-[#ccac54] hover:cursor-pointer hover:bg-[#c39f45] rounded-xl"
                >
                    {forArtist ? (
                        <>
                            <Compass className="h-6 w-6" />
                            <span>Back to Discover</span>
                        </>
                    ) : (
                        <>
                            <Briefcase className="h-6 w-6" />
                            <span>Artist Dashboard</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
