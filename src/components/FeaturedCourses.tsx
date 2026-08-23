"use client";

import { useEffect, useRef, useState } from "react";
import { getFeaturedChapters } from "@/lib/public";
import { getMyChaptersProgress } from "@/lib/student";
import { FeaturedChapterResponseDto, ChapterProgressResponseDto } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import ChapterPlaceholder from "@/components/ChapterPlaceholder";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaPlay } from "react-icons/fa";
import { useI18n } from "@/contexts/I18nProvider";

function ChapterImage({ chapter }: { chapter: any }) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <ChapterPlaceholder title={chapter.title} subjectName={chapter.subjectName} />;
    }

    return (
        <Image
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/v1/chapters/${chapter.chapterId || chapter.id}/cover-image`}
            alt={chapter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            unoptimized
        />
    );
}

export default function FeaturedCourses() {
    const { isLoggedIn, user } = useAuth();
    const { t } = useI18n();
    const [chapters, setChapters] = useState<FeaturedChapterResponseDto[]>([]);
    const [enrollmentMap, setEnrollmentMap] = useState<Map<number, number>>(new Map());
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(0);
    const scroller = useRef<HTMLDivElement>(null);

    const isStudent = user?.roles?.includes("STUDENT");

    // mobile carousel position tracking (for the dots)
    const onScroll = () => {
        const el = scroller.current;
        const first = el?.firstElementChild as HTMLElement | null;
        if (!el || !first) return;
        setActive(Math.round(el.scrollLeft / (first.offsetWidth + 24)));
    };
    const scrollTo = (i: number) => {
        const el = scroller.current;
        const first = el?.firstElementChild as HTMLElement | null;
        if (!el || !first) return;
        el.scrollTo({ left: i * (first.offsetWidth + 24), behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const [data, progress] = await Promise.all([
                    getFeaturedChapters(),
                    (isLoggedIn && isStudent) ? getMyChaptersProgress().catch(() => []) : Promise.resolve([])
                ]);

                setChapters(data);
                if (progress && progress.length > 0) {
                    const emap = new Map();
                    progress.forEach(p => emap.set(p.chapterId, p.progressPercentage));
                    setEnrollmentMap(emap);
                }
            } catch (error) {
                console.error("Failed to fetch featured chapters:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, [isLoggedIn, isStudent]);

    if (loading) {
        return (
            <div className="py-32">
                <LoadingSpinner label={t("home.featured.loading")} size="lg" />
            </div>
        );
    }

    if (chapters.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20 px-6 bg-gray-50">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 tracking-tight">{t("home.featured.title")}</h2>
            <div className="relative max-w-6xl mx-auto">
            <div
                ref={scroller}
                onScroll={onScroll}
                className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-3 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {chapters.map((c) => (
                    <Link
                        key={c.id}
                        href={enrollmentMap.has(c.chapterId) ? `/student/chapters/${c.chapterId}` : `/chapters/${c.chapterId}`}
                        className="snap-start shrink-0 w-[82%] max-w-[320px] md:w-auto md:max-w-none bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100"
                    >
                        <div className="aspect-video relative overflow-hidden bg-gray-100 block">
                            <ChapterImage chapter={c} />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-primary-600 rounded shadow-sm">
                                    {t("home.featured.badge")}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-primary-600 transition line-clamp-1">{c.title}</h3>
                            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-4">{c.subjectName} • {c.className}</p>
                            <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">{c.description}</p>
                            {enrollmentMap.has(c.chapterId) && (
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-grow bg-gray-100 rounded-full h-1.5 mr-3">
                                        <div
                                            className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${enrollmentMap.get(c.chapterId)}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600">{Math.round(enrollmentMap.get(c.chapterId) || 0)}%</span>
                                </div>
                            )}
                            <div className="mt-auto flex items-center justify-between">
                                <p className="text-xl font-bold text-primary-600">
                                    {c.free ? (
                                        <span className="text-green-600 uppercase tracking-tight">{t("home.free.badge")}</span>
                                    ) : (
                                        `৳${c.price}`
                                    )}
                                </p>
                                {enrollmentMap.has(c.chapterId) ? (
                                    <span
                                        className="py-2.5 px-6 bg-green-600 text-white rounded-lg font-bold text-xs tracking-widest group-hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center gap-2"
                                    >
                                        <FaPlay size={10} /> {t("student.dashboard.resume")}
                                    </span>
                                ) : (
                                    <span
                                        className="py-2.5 px-6 bg-primary-600 text-white rounded-lg font-bold text-xs tracking-widest group-hover:bg-primary-700 transition shadow-lg shadow-primary-100 text-center"
                                    >
                                        {t("home.featured.preview")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
            </div>
            {chapters.length > 1 && (
                <div className="flex md:hidden justify-center gap-1.5 mt-4">
                    {chapters.map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Go to featured ${i + 1}`}
                            onClick={() => scrollTo(i)}
                            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-primary-600" : "w-1.5 bg-gray-300"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
