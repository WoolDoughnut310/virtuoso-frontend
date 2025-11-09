import { Link, useLocation } from "react-router";
import { useLayoutContext } from "./LayoutProvider";

export default function Header() {
    const { adminControls } = useLayoutContext();
    const location = useLocation();
    const currentPath = location.pathname;
    const links = {
        "/": "Home",
        "/discover": "Discover",
        "/account": "Account",
    };

    return (
        <div className="flex flex-row px-16 py-8 border-b-4 border-b-[#ccac54] justify-between">
            <h1 className="font-bodoni-moda font-semibold text-6xl">
                Virtuoso
            </h1>
            <div className="flex flex-row justify-center items-center gap-16 text-2xl font-ibm-plex-sans font-normal text-[#282828]">
                {Object.entries(links).map(([path, name]) => {
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
            </div>
            {adminControls}
        </div>
    );
}
