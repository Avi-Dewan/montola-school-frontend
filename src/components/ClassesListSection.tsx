"use client";

import { getAllClasses } from "@/lib/public";
import { ClassResponseDto } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChapterPlaceholder from "./ChapterPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import { LuGraduationCap, LuArrowRight } from "react-icons/lu";

import { useI18n } from "@/contexts/I18nProvider";

export default function ClassesListSection() {
    const { t } = useI18n();
    const [classes, setClasses] = useState<ClassResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getAllClasses();
                setClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
                {classes.map((c) => (
                    <Link
                        key={c.id}
                        href={`/classes/${c.id}`}
                        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100"
                    >
                        {/* Rich cover image — desktop only */}
                        <div className="hidden md:block aspect-video relative overflow-hidden bg-gray-100">
                            <ChapterPlaceholder title={c.name} type="class" className="!p-4" />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <div className="p-4 md:p-6 flex flex-col flex-grow md:text-center">
                            {/* Compact icon — mobile only */}
                            <span className="md:hidden w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                                <LuGraduationCap size={18} />
                            </span>
                            <h3 className="text-base md:text-xl font-bold md:mb-1 group-hover:text-primary-600 transition line-clamp-1 tracking-tight">{c.name}</h3>
                            <p className="hidden md:block text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-4">Montola School</p>
                            <p className="hidden md:block text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                                {c.description || t("classes.fallbackDesc")}
                            </p>
                            <div className="mt-3 md:mt-auto flex items-center justify-between md:block">
                                <span className="md:hidden inline-flex items-center gap-1 text-primary-600 text-sm font-semibold">
                                    {t("classes.viewChapters")} <LuArrowRight size={14} />
                                </span>
                                <span className="hidden md:block w-full py-3 px-4 border-2 border-primary-600 text-primary-600 rounded-lg font-bold text-xs tracking-widest group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:-translate-y-1 text-center">
                                    VIEW CLASS
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
