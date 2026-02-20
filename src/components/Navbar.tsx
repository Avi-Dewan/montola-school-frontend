"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { getHighestPriorityRole } from "@/lib/roles";

export default function Navbar() {
    const { isLoggedIn, removeAuthTokens, isLoading, user, activeRole } = useAuth();
    const { t, lang, switchLang } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    const roles = user?.roles || [];
    const resolvedActiveRole =
        (activeRole && roles.includes(activeRole) && activeRole) ||
        getHighestPriorityRole(roles);

    const isStudent = resolvedActiveRole === "STUDENT";
    const isTeacher = resolvedActiveRole === "TEACHER";

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const getLinkClass = (href: string, baseClass: string = "") => {
        const activeClass = "text-primary-600 font-extrabold";
        const inactiveClass = "text-gray-800";
        return `${baseClass} ${isActive(href) ? activeClass : inactiveClass} hover:text-primary-500 transition-colors`;
    };

    // Function to render auth buttons
    const renderAuthButtons = () => {
        if (isLoading) {
            // Show loading state or nothing while checking auth
            return (
                <div className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg animate-pulse">
                    Loading...
                </div>
            );
        }

        if (isLoggedIn) {
            return (
                <button
                    onClick={removeAuthTokens}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    {t("auth.logout")}
                </button>
            );
        }

        return (
            <>
                <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition"
                >
                    {t("auth.login")}
                </Link>
                <Link
                    href="/auth/register"
                    className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition"
                >
                    {t("auth.register")}
                </Link>
            </>
        );
    };

    // Function to render mobile auth buttons
    const renderMobileAuthButtons = () => {
        if (isLoading) {
            return (
                <div className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg animate-pulse">
                    Loading...
                </div>
            );
        }

        if (isLoggedIn) {
            return (
                <button
                    onClick={() => {
                        removeAuthTokens();
                        setIsOpen(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    {t("auth.logout")}
                </button>
            );
        }

        return (
            <>
                <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto block px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition"
                >
                    {t("auth.login")}
                </Link>
                <Link
                    href="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto block px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition"
                >
                    {t("auth.register")}
                </Link>
            </>
        );
    };

    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                <Link href="/" className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition-colors">
                    Montola School
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex space-x-6 items-center">
                    {/* Common Public Links or Student Links */}
                    {(!isLoggedIn || isStudent) && (
                        <>
                            <Link href="/" className={getLinkClass("/")}>{t("nav.home")}</Link>
                            <Link href="/classes" className={getLinkClass("/classes")}>Classes</Link>
                            <Link href="/featured-chapters" className={getLinkClass("/featured-chapters")}>Featured Chapters</Link>
                            <Link href="/free-chapters" className={getLinkClass("/free-chapters")}>Free Chapters</Link>
                        </>
                    )}

                    {/* Role-specific Links */}
                    {isLoggedIn && isStudent && (
                        <>
                            <Link href="/student/dashboard" className={getLinkClass("/student/dashboard", "font-medium")}>
                                My Dashboard
                            </Link>
                        </>
                    )}

                    {isLoggedIn && isTeacher && (
                        <>
                            <Link href="/teacher" className={getLinkClass("/teacher", "font-medium")}>
                                My Dashboard
                            </Link>
                            <Link href="/teacher/assigned-chapters" className={getLinkClass("/teacher/assigned-chapters", "font-medium")}>
                                Assigned Chapters
                            </Link>
                        </>
                    )}

                    {renderAuthButtons()}

                    <select
                        value={lang}
                        onChange={(e) => switchLang(e.target.value as "en" | "bn")}
                        className="border p-1 rounded ml-4 text-xs font-bold"
                    >
                        <option value="en">EN</option>
                        <option value="bn">বাংলা</option>
                    </select>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
                    <div className="flex flex-col space-y-3">
                        {(!isLoggedIn || isStudent) && (
                            <>
                                <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClass("/", "py-1")}>{t("nav.home")}</Link>
                                <Link href="/classes" onClick={() => setIsOpen(false)} className={getLinkClass("/classes", "py-1")}>Classes</Link>
                                <Link href="/featured-chapters" onClick={() => setIsOpen(false)} className={getLinkClass("/featured-chapters", "py-1")}>Featured Chapters</Link>
                                <Link href="/free-chapters" onClick={() => setIsOpen(false)} className={getLinkClass("/free-chapters", "py-1")}>Free Chapters</Link>
                            </>
                        )}

                        {isLoggedIn && isStudent && (
                            <>
                                <Link
                                    href="/student/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className={getLinkClass("/student/dashboard", "py-1 font-medium")}
                                >
                                    My Dashboard
                                </Link>
                                <Link
                                    href="/student/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className={getLinkClass("/student/dashboard", "py-1 font-medium")}
                                >
                                    My Chapters
                                </Link>
                            </>
                        )}

                        {isLoggedIn && isTeacher && (
                            <>
                                <Link
                                    href="/teacher"
                                    onClick={() => setIsOpen(false)}
                                    className={getLinkClass("/teacher", "py-1 font-medium")}
                                >
                                    My Dashboard
                                </Link>
                                <Link
                                    href="/teacher/assigned-chapters"
                                    onClick={() => setIsOpen(false)}
                                    className={getLinkClass("/teacher/assigned-chapters", "py-1 font-medium")}
                                >
                                    Assigned Chapters
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                        <select
                            value={lang}
                            onChange={(e) => switchLang(e.target.value as "en" | "bn")}
                            className="w-full border p-2 rounded text-sm font-bold"
                        >
                            <option value="en">EN</option>
                            <option value="bn">বাংলা</option>
                        </select>
                        {renderMobileAuthButtons()}
                    </div>
                </div>
            )}
        </nav>
    );
}