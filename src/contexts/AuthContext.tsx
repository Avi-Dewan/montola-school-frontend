"use client";

import { getHighestPriorityRole } from "@/lib/roles";
import { AuthResponse, User } from "@/types";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  activeRole: string | null;
  setAuthTokens: (authResponse: AuthResponse) => void;
  removeAuthTokens: () => void;
  hasRole: (role: string) => boolean;
  isAdminOrManager: () => boolean;
  getAvailableRoles: () => string[];
  setActiveRole: (role: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const ACTIVE_ROLE_STORAGE_KEY = "activeRole";

  useEffect(() => {
    try {
      const storedAccess = localStorage.getItem("accessToken");
      const storedRefresh = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");
      const storedActiveRole = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);

      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);

      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);

          const roles = parsedUser.roles || [];
          if (roles.length > 0) {
            let initialActiveRole: string | null = null;

            if (storedActiveRole && roles.includes(storedActiveRole)) {
              initialActiveRole = storedActiveRole;
            } else {
              initialActiveRole = getHighestPriorityRole(roles);
            }

            setActiveRoleState(initialActiveRole);
          } else {
            setActiveRoleState(null);
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
          setActiveRoleState(null);
        }
      } else {
        setActiveRoleState(null);
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
      roles,
    };
    localStorage.setItem("user", JSON.stringify(userData));

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(userData);

    // Determine and persist the active role based on precedence
    const nextActiveRole = getHighestPriorityRole(userData.roles);
    if (nextActiveRole) {
      localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, nextActiveRole);
      setActiveRoleState(nextActiveRole);
    } else {
      localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
      setActiveRoleState(null);
    }
  };

  const removeAuthTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setActiveRoleState(null);

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

  // Update activeRole and persist to localStorage (as a UI preference only)
  const setActiveRole = (role: string | null) => {
    const roles = user?.roles || [];

    if (!role) {
      // Clear active role explicitly
      localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
      setActiveRoleState(null);
      return;
    }

    if (roles.length === 0) {
      // No roles available on user; nothing to persist
      localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
      setActiveRoleState(null);
      return;
    }

    // If the requested role is not part of the user's roles, fall back to highest priority
    const finalRole = roles.includes(role)
      ? role
      : getHighestPriorityRole(roles);

    if (finalRole) {
      localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, finalRole);
      setActiveRoleState(finalRole);
    } else {
      localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
      setActiveRoleState(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!accessToken,
        isLoading,
        accessToken,
        refreshToken,
        user,
        activeRole,
        setAuthTokens,
        removeAuthTokens,
        hasRole,
        isAdminOrManager,
        getAvailableRoles,
        setActiveRole,
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
