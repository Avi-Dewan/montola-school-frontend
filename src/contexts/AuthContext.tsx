"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    setAuthTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
    removeAuthTokens: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        try {
            const storedAccess = localStorage.getItem("accessToken");
            const storedRefresh = localStorage.getItem("refreshToken");

            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);

        } catch (error) {
            console.error("Failed to load tokens from localStorage:", error);

        } finally {
            setIsLoading(false); // Always set loading to false when done
        }
    }, []);

    const setAuthTokens = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const removeAuthTokens = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);

        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!accessToken,
                isLoading,
                accessToken,
                refreshToken,
                setAuthTokens,
                removeAuthTokens
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

    return ctx;
}
