"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import RoleToggle from "@/components/admin/RoleToggle";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { hasRole, isLoading, user, activeRole } = useAuth();
    const { t, lang, switchLang } = useI18n();
    const router = useRouter();

    const isTeacher = () => {
        // Check if user has TEACHER role or is admin/manager with teacher role active
        return hasRole("TEACHER") || ((hasRole("ADMIN") || hasRole("MANAGER")) && activeRole === "TEACHER");
    };

    useEffect(() => {
        // Wait for auth to finish loading
        if (isLoading) return;

        // Redirect if user is not teacher (or admin/manager with teacher role active)
        if (!isTeacher()) {
            router.push("/auth/login");
        }
    }, [isLoading, router, activeRole]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("messages.loading")}</p>
                </div>
            </div>
        );
    }

    // Don't render content if user is not authorized
    if (!isTeacher()) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with role toggle */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                            {t("teacher.dashboard")}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        {/* User Info - hidden on small screens */}
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-800">
                                {user?.fullName || user?.email}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>

                        {/* Role Toggle - only visible if user has multiple roles */}
                        <RoleToggle />

                        {/* Language Switch */}
                        <select
                            value={lang}
                            onChange={(e) => switchLang(e.target.value as "en" | "bn")}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="en">EN</option>
                            <option value="bn">বাংলা</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto p-4 md:p-6">
                {children}
            </main>
        </div>
    );
}
