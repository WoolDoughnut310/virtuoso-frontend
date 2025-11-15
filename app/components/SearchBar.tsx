import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useClickOutsideAndEscape } from "~/lib/useClickOutsideAndEscape";

export default function SearchBar() {
    const [_, setSearchParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    useClickOutsideAndEscape(
        searchRef,
        () => setIsSearchOpen(false),
        isSearchOpen
    );
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchParams({ q: query });
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (!isSearchOpen) return;
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        return () => clearTimeout(timer);
    }, [isSearchOpen]);

    return (
        <div ref={searchRef} className="flex flex-row items-center">
            <input
                type="text"
                placeholder="Search..."
                ref={inputRef}
                className={`
                bg-white/80 border-b-2 border-[#C39F45] 
                text-lg focus:outline-none transition-all duration-300
                ${isSearchOpen ? "w-64 opacity-100 py-2 px-4" : "w-0 opacity-0 px-0 py-0"}
            `}
                autoFocus={isSearchOpen}
                disabled={!isSearchOpen}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setIsSearchOpen(false);
                    }
                }}
            />
            <button
                type="button"
                className="p-2
        text-[#C39F45]
        hover:text-[#A88C3E]
        focus:outline-none
        focus:ring-2 focus:ring-[#C39F45]/50
        rounded-full
        hover:cursor-pointer
        transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
                <Search size={24} />
            </button>
        </div>
    );
}
