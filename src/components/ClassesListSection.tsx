"use client";

import { getAllClasses, getClassPublicStructure } from "@/lib/public";
import { getMyChaptersProgress } from "@/lib/student";
import { useAuth } from "@/contexts/AuthContext";
import { ClassResponseDto } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChapterPlaceholder from "./ChapterPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import {
    LuBookOpen, LuAtom, LuTelescope, LuLaptop, LuGraduationCap, LuCompass, LuChevronRight,
    LuChevronDown, LuLayoutGrid,
} from "react-icons/lu";

import { useI18n } from "@/contexts/I18nProvider";

const bnDigits = "০১২৩৪৫৬৭৮৯";
const localeNum = (n: number, lang: string) =>
    lang === "bn" ? String(n).replace(/\d/g, (d) => bnDigits[+d]) : String(n);

// Each card gets its own colour + icon, cycled by position.
const themes = [
    { tile: "bg-blue-50", fg: "text-blue-600", bar: "bg-blue-500", Icon: LuBookOpen },
    { tile: "bg-orange-50", fg: "text-orange-600", bar: "bg-orange-500", Icon: LuAtom },
    { tile: "bg-purple-50", fg: "text-purple-600", bar: "bg-purple-500", Icon: LuTelescope },
    { tile: "bg-teal-50", fg: "text-teal-600", bar: "bg-teal-500", Icon: LuLaptop },
    { tile: "bg-emerald-50", fg: "text-emerald-600", bar: "bg-emerald-500", Icon: LuGraduationCap },
    { tile: "bg-violet-50", fg: "text-violet-600", bar: "bg-violet-500", Icon: LuCompass },
];

interface ClassMeta {
    chapters: number;
    subjects: number;
    progress: number | null; // null when the visitor has no progress to show
}

export default function ClassesListSection() {
    const { t, lang } = useI18n();
    const { isLoggedIn, user } = useAuth();
    const [classes, setClasses] = useState<ClassResponseDto[]>([]);
    const [meta, setMeta] = useState<Record<number, ClassMeta>>({});
    const [loading, setLoading] = useState(true);
    // Mobile only: the grid stays folded away so the page is short to scroll.
    const [open, setOpen] = useState(false);

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
                    Promise.all(
                        data.map((c) => getClassPublicStructure(c.id).catch(() => null))
                    ),
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
                        // Average across every chapter in the class, so untouched
                        // chapters correctly drag the number down.
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
            {/* Mobile trigger — tells the visitor exactly what a tap will do */}
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

            {/* 0fr → 1fr animates height without needing to measure the content */}
            <div
                className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
                <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 max-w-6xl mx-auto pt-4">
                        {classes.map((c, i) => {
                            const th = themes[i % themes.length];
                            const m = meta[c.id];
                            const Icon = th.Icon;
                            return (
                                <Link
                                    key={c.id}
                                    href={`/classes/${c.id}`}
                                    style={{ transitionDelay: `${open ? i * 60 : 0}ms` }}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden group transition-all duration-500 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                >
                                    <div className="p-3.5 flex flex-col flex-grow">
                                        <span className={`w-12 h-12 rounded-xl ${th.tile} ${th.fg} flex items-center justify-center mb-3`}>
                                            <Icon size={22} />
                                        </span>
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-1 tracking-tight">{c.name}</h3>
                                        {m ? (
                                            <p className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">
                                                {m.chapters} {t(m.chapters === 1 ? "classes.chapter" : "classes.chaptersShort")}{" "}
                                                <span className="text-gray-300">|</span>{" "}
                                                {m.subjects} {t(m.subjects === 1 ? "classes.subject" : "classes.subjects")}
                                            </p>
                                        ) : (
                                            <div className="h-4 mt-1.5 w-24 bg-gray-100 rounded animate-pulse" />
                                        )}
                                        {m && m.progress !== null ? (
                                            <div className="mt-auto pt-3">
                                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div className={`h-full ${th.bar} rounded-full`} style={{ width: `${m.progress}%` }} />
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">{m.progress}% {t("classes.complete")}</span>
                                                    <LuChevronRight className="text-gray-400" size={16} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-auto pt-3 flex items-center justify-between">
                                                <span className="text-xs font-semibold text-primary-600">{t("classes.viewChapters")}</span>
                                                <LuChevronRight className="text-gray-400" size={16} />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop keeps the always-visible grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {classes.map((c) => {
                    const m = meta[c.id];
                    return (
                        <Link
                            key={c.id}
                            href={`/classes/${c.id}`}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100"
                        >
                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                                <ChapterPlaceholder title={c.name} type="class" className="!p-4" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1 tracking-tight">
                                    {c.name}
                                </h3>

                                {m ? (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {m.chapters} {t(m.chapters === 1 ? "classes.chapter" : "classes.chaptersShort")}{" "}
                                        <span className="text-gray-300">|</span>{" "}
                                        {m.subjects} {t(m.subjects === 1 ? "classes.subject" : "classes.subjects")}
                                    </p>
                                ) : (
                                    <div className="h-4 mt-1.5 w-24 bg-gray-100 rounded animate-pulse" />
                                )}

                                {m && m.progress !== null ? (
                                    <div className="mt-auto pt-3">
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                                style={{ width: `${m.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">
                                                {m.progress}% {t("classes.complete")}
                                            </span>
                                            <LuChevronRight className="text-gray-400 group-hover:text-primary-600 transition" size={16} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-auto pt-3 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-primary-600">
                                            {t("classes.viewChapters")}
                                        </span>
                                        <LuChevronRight className="text-gray-400 group-hover:text-primary-600 transition" size={16} />
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
