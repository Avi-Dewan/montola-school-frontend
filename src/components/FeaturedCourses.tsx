"use client";

import { useEffect, useState } from "react";
import { getFeaturedChapters } from "@/lib/public";
import { FeaturedChapterResponseDto } from "@/types";
import Link from "next/link";
import Image from "next/image";
import ChapterPlaceholder from "@/components/ChapterPlaceholder";

function ChapterImage({ chapter }: { chapter: any }) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <ChapterPlaceholder title={chapter.title} subjectName={chapter.subjectName} />;
    }

    return (
        <Image
            src={`http://localhost:8080/api/v1/chapters/${chapter.chapterId || chapter.id}/cover-image`}
            alt={chapter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            unoptimized
        />
    );
}

export default function FeaturedCourses() {
    const [chapters, setChapters] = useState<FeaturedChapterResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const data = await getFeaturedChapters();
                setChapters(data);
            } catch (error) {
                console.error("Failed to fetch featured chapters:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, []);

    if (loading) {
        return <div className="py-20 text-center">Loading featured courses...</div>;
    }

    if (chapters.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-6 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {chapters.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <ChapterImage chapter={c} />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black text-primary-600 rounded shadow-sm">
                                    FEATURED
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-primary-600 transition line-clamp-1">{c.title}</h3>
                            <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-4">{c.subjectName} • {c.className}</p>
                            <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">{c.description}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <p className="text-xl font-black text-primary-600">
                                    {c.free ? (
                                        <span className="text-green-600 uppercase tracking-tighter">Free</span>
                                    ) : (
                                        `৳${c.price}`
                                    )}
                                </p>
                                <Link
                                    href={`/chapters/${c.chapterId}`}
                                    className="py-2 px-6 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition shadow-lg shadow-primary-100"
                                >
                                    PREVIEW
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
