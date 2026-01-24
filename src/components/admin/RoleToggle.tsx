"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import { HiChevronDown, HiCheck } from "react-icons/hi";

export default function RoleToggle() {
    const { user, getAvailableRoles } = useAuth();
    const { t } = useI18n();
    const availableRoles = getAvailableRoles();
    const [isOpen, setIsOpen] = useState(false);

    // Only show role toggle if user has multiple roles
    if (!availableRoles || availableRoles.length <= 1) {
        return null;
    }

    // For now, we'll use the first role as the active role
    // In a full implementation, you might store the active role in context or localStorage
    const [activeRole, setActiveRole] = useState(availableRoles[0] || "");

    const handleRoleChange = (role: string) => {
        setActiveRole(role);
        setIsOpen(false);
        // TODO: Update role context/state when role switching is fully implemented
    };

    // Helper function to get translation key for role (backend uses uppercase, i18n uses lowercase)
    const getRoleTranslationKey = (role: string): string => {
        return `roles.${role.toLowerCase()}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
                <span className="font-medium">{t(getRoleTranslationKey(activeRole))}</span>
                <HiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="py-2">
                            {availableRoles.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleChange(role)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                                        activeRole === role ? "text-primary-600" : "text-gray-700"
                                    }`}
                                >
                                    <span>{t(getRoleTranslationKey(role))}</span>
                                    {activeRole === role && (
                                        <HiCheck className="w-5 h-5 text-primary-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
