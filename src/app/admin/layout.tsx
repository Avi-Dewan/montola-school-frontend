"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RoleToggle from "@/components/admin/RoleToggle";
import { HiMenu } from "react-icons/hi";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAdminOrManager, isLoading, user, removeAuthTokens } = useAuth();
    const { t } = useI18n();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Wait for auth to finish loading
        if (isLoading) return;

        // Redirect if user is not admin or manager
        if (!isAdminOrManager()) {
            router.push("/auth/login");
        }
    }, [isAdminOrManager, isLoading, router]);

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
    if (!isAdminOrManager()) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar 
                isMobileOpen={isMobileMenuOpen} 
                onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 md:px-6 py-4">
                        {/* Mobile menu button */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-gray-600 hover:text-gray-800"
                            >
                                <HiMenu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t("admin.dashboard")}</h1>
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

                            {/* Logout Button */}
                            <button
                                onClick={removeAuthTokens}
                                className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                {t("auth.logout")}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
