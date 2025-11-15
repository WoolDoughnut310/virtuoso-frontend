// context/AuthContext.tsx

import React, { createContext, useContext, type ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useCurrentUserQuery } from "./useCurrentUser";
import type { UserPublic } from "~/client";

interface AuthContextValue {
    query: UseQueryResult<UserPublic, Error>;

    user?: UserPublic;
    isAuthenticated: boolean;
    artistId: number | null | undefined;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const query = useCurrentUserQuery();
    const user = query.data;

    const isAuthenticated = query.isSuccess && !!user;

    const value: AuthContextValue = {
        user,
        query,
        isAuthenticated,
        artistId: user?.artist_id,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
