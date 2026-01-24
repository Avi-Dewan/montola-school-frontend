"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthResponse, User } from "@/types";

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    setAuthTokens: (authResponse: AuthResponse) => void;
    removeAuthTokens: () => void;
    hasRole: (role: string) => boolean;
    isAdminOrManager: () => boolean;
    getAvailableRoles: () => string[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        try {
            const storedAccess = localStorage.getItem("accessToken");
            const storedRefresh = localStorage.getItem("refreshToken");
            const storedUser = localStorage.getItem("user");

            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
            
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from localStorage:", e);
                }
            }

        } catch (error) {
            console.error("Failed to load tokens from localStorage:", error);

        } finally {
            setIsLoading(false); // Always set loading to false when done
        }
    }, []);

    const setAuthTokens = (authResponse: AuthResponse) => {
        const { accessToken, refreshToken, email, fullName, roles } = authResponse;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Store user info from AuthResponse (email, fullName, roles)
        const userData: User = { 
            email, 
            fullName, 
            roles 
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(userData);
    };

    const removeAuthTokens = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);

        router.push("/auth/login");
    };

    const hasRole = (role: string): boolean => {
        return user?.roles.includes(role) ?? false;
    };

    const isAdminOrManager = (): boolean => {
        return hasRole("ADMIN") || hasRole("MANAGER");
    };

    const getAvailableRoles = (): string[] => {
        return user?.roles ?? [];
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!accessToken,
                isLoading,
                accessToken,
                refreshToken,
                user,
                setAuthTokens,
                removeAuthTokens,
                hasRole,
                isAdminOrManager,
                getAvailableRoles
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
