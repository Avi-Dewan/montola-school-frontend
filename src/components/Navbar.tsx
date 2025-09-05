"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const { t, lang, switchLang } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-2xl font-bold text-primary-500">Montola School</div>

                {/* Desktop links */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link href="/" className="hover:text-primary-500">{t("nav.home")}</Link>
                    <Link href="/courses" className="hover:text-primary-500">{t("nav.courses")}</Link>
                    <Link href="/teachers" className="hover:text-primary-500">{t("nav.teachers")}</Link>
                    <Link href="/pricing" className="hover:text-primary-500">{t("nav.pricing")}</Link>
                    <Link href="/about" className="hover:text-primary-500">{t("nav.about")}</Link>

                    {isLoggedIn ? (
                        <button
                            onClick={logout}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            {t("auth.logout")}
                        </button>
                    ) : (
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
                    )}

                    <select
                        value={lang}
                        onChange={(e) => switchLang(e.target.value as "en" | "bn")}
                        className="border p-1 rounded ml-4"
                    >
                        <option value="en">EN</option>
                        <option value="bn">বাংলা</option>
                    </select>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="flex flex-col space-y-2 p-4 bg-white shadow-md sm:flex-row sm:space-x-6 sm:space-y-0 sm:p-0 sm:bg-transparent sm:shadow-none items-start sm:items-center">

                    <Link href="/" onClick={() => setIsOpen(false)} className="w-full sm:w-auto block px-2 py-1 hover:text-primary-500">{t("nav.home")}</Link>
                    <Link href="/courses" onClick={() => setIsOpen(false)} className="w-full sm:w-auto block px-2 py-1 hover:text-primary-500">{t("nav.courses")}</Link>
                    <Link href="/teachers" onClick={() => setIsOpen(false)} className="w-full sm:w-auto block px-2 py-1 hover:text-primary-500">{t("nav.teachers")}</Link>
                    <Link href="/pricing" onClick={() => setIsOpen(false)} className="w-full sm:w-auto block px-2 py-1 hover:text-primary-500">{t("nav.pricing")}</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="w-full sm:w-auto block px-2 py-1 hover:text-primary-500">{t("nav.about")}</Link>

                    {isLoggedIn ? (
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            {t("auth.logout")}
                        </button>
                    ) : (
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
                    )}

                    <select
                        value={lang}
                        onChange={(e) => switchLang(e.target.value as "en" | "bn")}
                        className="w-full sm:w-auto border p-2 rounded mt-2 sm:mt-0"
                    >
                        <option value="en">EN</option>
                        <option value="bn">বাংলা</option>
                    </select>

                </div>
            )}
        </nav>
    );
}
