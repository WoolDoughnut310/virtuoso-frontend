import React, { createContext, useContext, useState } from "react";
import type { ReactNode, SetStateAction, Dispatch } from "react";

interface LayoutContextType {
    adminControls: ReactNode | null;
    setAdminControls: Dispatch<SetStateAction<ReactNode | null>>;
}

const LayoutContext = createContext<LayoutContextType>({
    adminControls: null,
    setAdminControls: () => {},
});

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [adminControls, setAdminControls] = useState<ReactNode | null>(null);

    const contextValue: LayoutContextType = {
        adminControls,
        setAdminControls,
    };

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = (): LayoutContextType => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error(
            "useLayoutContext must be used within a LayoutProvider"
        );
    }
    return context;
};
