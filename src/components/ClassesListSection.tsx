"use client";

import { getAllClasses, getClassPublicStructure } from "@/lib/public";
import { getMyChaptersProgress } from "@/lib/student";
import { useAuth } from "@/contexts/AuthContext";
import { ClassResponseDto } from "@/types";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { LuArrowRight, LuChevronDown, LuLayoutGrid } from "react-icons/lu";

import { useI18n } from "@/contexts/I18nProvider";

const bnDigits = "০১২৩৪৫৬৭৮৯";
const localeNum = (n: number | string, lang: string) =>
    lang === "bn" ? String(n).replace(/\d/g, (d) => bnDigits[+d]) : String(n);

// One colour per class number, so a class always reads the same.
const palette: Record<number, string> = {
    6: "bg-blue-600",
    7: "bg-orange-500",
    8: "bg-violet-600",
    9: "bg-teal-600",
    10: "bg-emerald-600",
    11: "bg-rose-500",
    12: "bg-indigo-600",
};
const accentFor = (n: number | null) => (n && palette[n]) || "bg-gray-600";

const classNumber = (name: string) => {
    const m = name.match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
};

// Bangladesh's own structure — the grouping carries real meaning, so a
// Class 9 family immediately sees "SSC board preparation".
const LEVELS = [
    { key: "jsc", test: (n: number) => n >= 6 && n <= 8 },
    { key: "ssc", test: (n: number) => n >= 9 && n <= 10 },
    { key: "hsc", test: (n: number) => n >= 11 && n <= 12 },
];

interface ClassMeta {
    chapters: number;
    subjects: number;
    progress: number | null; // null when there is no progress to show
}

function ClassCard({
    c,
    m,
    lang,
    t,
}: {
    c: ClassResponseDto;
    m?: ClassMeta;
    lang: string;
    t: (k: string) => string;
}) {
    const n = classNumber(c.name);
    return (
        <Link
            href={`/classes/${c.id}`}
            className="group bg-white rounded-2xl border border-gray-200 p-4 md:p-5 flex items-center gap-4 hover:border-gray-900 hover:shadow-lg transition-all duration-300"
        >
            <span
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${accentFor(n)} text-white flex items-center justify-center text-xl md:text-2xl font-extrabold shrink-0`}
            >
                {n !== null ? localeNum(n, lang) : "•"}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block font-bold text-gray-900 md:text-lg leading-tight truncate">{c.name}</span>

                {m ? (
                    <span className="block text-xs md:text-sm text-gray-500 mt-0.5">
                        {localeNum(m.chapters, lang)} {t(m.chapters === 1 ? "classes.chapter" : "classes.chaptersShort")}
                        <span className="mx-1.5 text-gray-300">·</span>
                        {localeNum(m.subjects, lang)} {t(m.subjects === 1 ? "classes.subject" : "classes.subjects")}
                    </span>
                ) : (
                    <span className="block h-4 mt-1.5 w-28 bg-gray-100 rounded animate-pulse" />
                )}

                {m && m.progress !== null && (
                    <span className="block mt-2">
                        <span className="block h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <span
                                className={`block h-full ${accentFor(n)} rounded-full transition-all duration-500`}
                                style={{ width: `${m.progress}%` }}
                            />
                        </span>
                        <span className="block text-[11px] text-gray-500 mt-1">
                            {localeNum(m.progress, lang)}% {t("classes.complete")}
                        </span>
                    </span>
                )}
            </span>

            <LuArrowRight
                className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all shrink-0"
                size={20}
            />
        </Link>
    );
}

export default function ClassesListSection() {
    const { t, lang } = useI18n();
    const { isLoggedIn, user } = useAuth();
    const [classes, setClasses] = useState<ClassResponseDto[]>([]);
    const [meta, setMeta] = useState<Record<number, ClassMeta>>({});
    const [loading, setLoading] = useState(true);
    // Mobile only: the list stays folded so the page is short to scroll.
    const [open, setOpen] = useState(false);
    // Height is measured rather than animated via grid-template-rows: with an
    // overflow-hidden block child the fr track collapses to 0.
    const contentRef = useRef<HTMLDivElement>(null);
    const [panelH, setPanelH] = useState(0);

    const isStudent = user?.roles?.includes("STUDENT");

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getAllClasses();
                setClasses(data);
                setLoading(false);

                // Counts and progress are a second, non-blocking pass so the
                // cards paint immediately.
                const [structures, progress] = await Promise.all([
                    Promise.all(data.map((c) => getClassPublicStructure(c.id).catch(() => null))),
                    isLoggedIn && isStudent ? getMyChaptersProgress().catch(() => []) : Promise.resolve([]),
                ]);

                const progressByChapter = new Map(
                    (progress || []).map((p) => [p.chapterId, p.progressPercentage])
                );

                const next: Record<number, ClassMeta> = {};
                structures.forEach((s, i) => {
                    if (!s) return;
                    const chapterIds = s.subjects.flatMap((sub) => sub.chapters.map((ch) => ch.id));
                    const tracked = chapterIds.filter((id) => progressByChapter.has(id));
                    next[data[i].id] = {
                        chapters: chapterIds.length,
                        subjects: s.subjects.length,
                        // Average across every chapter, so untouched chapters
                        // correctly drag the number down.
                        progress:
                            tracked.length > 0 && chapterIds.length > 0
                                ? Math.round(
                                      chapterIds.reduce((sum, id) => sum + (progressByChapter.get(id) || 0), 0) /
                                          chapterIds.length
                                  )
                                : null,
                    };
                });
                setMeta(next);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, [isLoggedIn, isStudent]);

    // Anything outside 6–12 still gets shown, under "Other".
    const groups = useMemo(() => {
        const out = LEVELS.map((lv) => ({
            key: lv.key,
            items: classes.filter((c) => {
                const n = classNumber(c.name);
                return n !== null && lv.test(n);
            }),
        }));
        const rest = classes.filter((c) => {
            const n = classNumber(c.name);
            return n === null || !LEVELS.some((lv) => lv.test(n));
        });
        if (rest.length) out.push({ key: "other", items: rest });
        return out.filter((g) => g.items.length > 0);
    }, [classes]);

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

    const levelGroups = (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
            {groups.map((g) => (
                <div key={g.key}>
                    <div className="flex items-baseline gap-3 mb-4">
                        <h3
                            className={`text-sm font-bold text-gray-900 shrink-0 ${lang === "en" ? "uppercase tracking-widest" : ""}`}
                        >
                            {t(`classes.levels.${g.key}.label`)}
                        </h3>
                        {t(`classes.levels.${g.key}.note`) && (
                            <span className="text-xs text-gray-400 truncate">{t(`classes.levels.${g.key}.note`)}</span>
                        )}
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {g.items.map((c) => (
                            <ClassCard key={c.id} c={c} m={meta[c.id]} lang={lang} t={t} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

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
                    {levelGroups}
                </div>
            </div>

            {/* Desktop: always visible */}
            <div className="hidden md:block">{levelGroups}</div>
        </section>
    );
}
