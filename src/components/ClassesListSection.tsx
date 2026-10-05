"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import { LuChevronDown, LuLayoutGrid } from "react-icons/lu";
import LoadingSpinner from "./LoadingSpinner";
import ClassLevelGroups from "./classes/ClassLevelGroups";
import { localeNum, useClassesWithMeta } from "@/lib/classGroups";

export default function ClassesListSection() {
    const { t, lang } = useI18n();
    const { isLoggedIn, user } = useAuth();
    const isStudent = !!user?.roles?.includes("STUDENT");

    const { classes, meta, groups, loading } = useClassesWithMeta(isLoggedIn, isStudent);

    // Mobile only: the list stays folded so the page is short to scroll.
    const [open, setOpen] = useState(false);
    // Height is measured rather than animated via grid-template-rows: with an
    // overflow-hidden block child the fr track collapses to 0.
    const contentRef = useRef<HTMLDivElement>(null);
    const [panelH, setPanelH] = useState(0);

    // Re-measure whenever the content or viewport could have changed.
    useEffect(() => {
        const measure = () => {
            if (contentRef.current) setPanelH(contentRef.current.scrollHeight);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [open, meta, classes, lang]);

    if (loading) {
        return (
            <div className="py-20">
                <LoadingSpinner label={t("home.classes.loading")} size="lg" />
            </div>
        );
    }

    if (classes.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20 px-6 bg-gray-50">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
                    {t("home.classes.title")}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto md:text-lg leading-relaxed">
                    {t("home.classes.subtitle")}
                </p>
            </div>

            {/* Mobile trigger — says exactly what a tap will do */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="md:hidden w-full max-w-md mx-auto flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-left active:scale-[0.99] transition"
            >
                <span className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <LuLayoutGrid size={22} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block font-bold text-gray-900">
                        {t("classes.availableCount", { n: localeNum(classes.length, lang) })}
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                        {open ? t("classes.hideList") : t("classes.tapPrompt")}
                    </span>
                </span>
                <LuChevronDown
                    size={20}
                    className={`shrink-0 text-primary-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <div
                className="md:hidden overflow-hidden transition-[height] duration-500 ease-out"
                style={{ height: open ? panelH : 0 }}
            >
                <div
                    ref={contentRef}
                    className={`pt-5 transition-all duration-500 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    <ClassLevelGroups groups={groups} meta={meta} />
                </div>
            </div>

            {/* Desktop: always visible */}
            <div className="hidden md:block">
                <ClassLevelGroups groups={groups} meta={meta} />
            </div>
        </section>
    );
}
