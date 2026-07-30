"use client";

import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { ClassResponseDto } from "@/types";
import { useI18n } from "@/contexts/I18nProvider";
import { ClassGroup, ClassMeta, accentFor, classNumber, localeNum } from "@/lib/classGroups";

export function ClassCard({ c, m }: { c: ClassResponseDto; m?: ClassMeta }) {
    const { t, lang } = useI18n();
    const n = classNumber(c.name);

    return (
        <Link
            href={`/classes/${c.id}`}
            /* Mobile: a compact row. Desktop: a square tile. */
            className="group bg-white rounded-2xl border border-gray-200 p-4 md:p-6 transition-all duration-300 hover:border-gray-900 hover:shadow-lg
                       flex items-center gap-4
                       md:aspect-square md:flex-col md:items-stretch md:justify-between md:gap-0"
        >
            <span
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl ${accentFor(n)} text-white flex items-center justify-center text-xl md:text-3xl font-extrabold shrink-0 md:self-start`}
            >
                {n !== null ? localeNum(n, lang) : "•"}
            </span>

            <span className="min-w-0 flex-1 md:flex-none md:w-full">
                <span className="block font-bold text-gray-900 md:text-xl leading-tight truncate">{c.name}</span>

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

                {/* Desktop gets a written call to action instead of a bare arrow */}
                <span className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-900 mt-3">
                    {t("classes.viewChapters")}
                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                </span>
            </span>

            <LuArrowRight
                className="md:hidden text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all shrink-0"
                size={20}
            />
        </Link>
    );
}

/** The level-grouped class list, shared by the homepage section and /classes. */
export default function ClassLevelGroups({
    groups,
    meta,
}: {
    groups: ClassGroup[];
    meta: Record<number, ClassMeta>;
}) {
    const { t, lang } = useI18n();

    return (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                        {g.items.map((c) => (
                            <ClassCard key={c.id} c={c} m={meta[c.id]} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
