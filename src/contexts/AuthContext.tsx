"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    login: (tokens: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
    }, []);

    const login = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);

        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn: !!accessToken, accessToken, refreshToken, login, logout }}
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
