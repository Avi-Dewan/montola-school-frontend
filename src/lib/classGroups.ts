"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllClasses, getClassPublicStructure } from "@/lib/public";
import { getMyChaptersProgress } from "@/lib/student";
import { ClassResponseDto } from "@/types";

const bnDigits = "০১২৩৪৫৬৭৮৯";

export const localeNum = (n: number | string, lang: string) =>
    lang === "bn" ? String(n).replace(/\d/g, (d) => bnDigits[+d]) : String(n);

// One colour per class number, so a class always reads the same everywhere.
const palette: Record<number, string> = {
    6: "bg-blue-600",
    7: "bg-orange-500",
    8: "bg-violet-600",
    9: "bg-teal-600",
    10: "bg-emerald-600",
    11: "bg-rose-500",
    12: "bg-indigo-600",
};

export const accentFor = (n: number | null) => (n && palette[n]) || "bg-gray-600";

export const classNumber = (name: string) => {
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

export interface ClassMeta {
    chapters: number;
    subjects: number;
    progress: number | null; // null when there is no progress to show
}

export interface ClassGroup {
    key: string;
    items: ClassResponseDto[];
}

/** Groups by level; anything outside 6–12 lands in "other" rather than vanishing. */
export function groupByLevel(classes: ClassResponseDto[]): ClassGroup[] {
    const out: ClassGroup[] = LEVELS.map((lv) => ({
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
}

/**
 * Loads classes, then fills in chapter/subject counts (and per-class progress
 * for signed-in students) in a second, non-blocking pass so cards paint fast.
 */
export function useClassesWithMeta(isLoggedIn: boolean, isStudent: boolean) {
    const [classes, setClasses] = useState<ClassResponseDto[]>([]);
    const [meta, setMeta] = useState<Record<number, ClassMeta>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await getAllClasses();
                if (cancelled) return;
                setClasses(data);
                setLoading(false);

                const [structures, progress] = await Promise.all([
                    Promise.all(data.map((c) => getClassPublicStructure(c.id).catch(() => null))),
                    isLoggedIn && isStudent ? getMyChaptersProgress().catch(() => []) : Promise.resolve([]),
                ]);
                if (cancelled) return;

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
            } catch (e) {
                console.error("Failed to fetch classes:", e);
                if (!cancelled) {
                    setError(true);
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn, isStudent]);

    const groups = useMemo(() => groupByLevel(classes), [classes]);

    return { classes, meta, groups, loading, error };
}
