import { useEffect, type RefObject } from "react";

/**
 * Hook to handle closing an element when the user clicks outside of it
 * or presses the Escape key.
 *
 * @param ref - A React ref attached to the DOM element (the search bar container).
 * @param closeHandler - The function to call to hide the element (e.g., setToggle(false)).
 * @param isOpen - The state that indicates if the element is currently visible.
 */
export const useClickOutsideAndEscape = (
    ref: RefObject<HTMLElement | null>,
    closeHandler: () => void,
    isOpen: boolean
) => {
    useEffect(() => {
        if (!isOpen) {
            // Only attach listeners when the element is actually visible
            return;
        }

        // 1. Click Handler
        const handleClickOutside = (event: MouseEvent) => {
            // If the user clicks outside the referenced element, call the handler
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeHandler();
            }
        };

        // 2. Escape Key Handler
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeHandler();
            }
        };

        // Attach the global listeners
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        // Cleanup: Remove listeners when the component unmounts or dependencies change
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [ref, closeHandler, isOpen]); // Rerun effect only when these change
};
