"use client";

import { useEffect, useState } from "react";
import { getFreeChapters } from "@/lib/public";
import { ChapterResponseDto } from "@/types";
import Link from "next/link";
import Image from "next/image";
import ChapterPlaceholder from "@/components/ChapterPlaceholder";

function ChapterImage({ chapter }: { chapter: ChapterResponseDto }) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <ChapterPlaceholder title={chapter.title} subjectName={chapter.subjectName} />;
    }

    return (
        <Image
            src={`http://localhost:8080/api/v1/chapters/${chapter.id}/cover-image`}
            alt={chapter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            unoptimized
        />
    );
}

export default function FreeChapterList() {
    const [chapters, setChapters] = useState<ChapterResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const data = await getFreeChapters();
                setChapters(data);
            } catch (error) {
                console.error("Failed to fetch free chapters:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, []);

    if (loading) {
        return <div className="py-10 text-center">Loading free chapters...</div>;
    }

    if (chapters.length === 0) {
        return null; // Don't show section if no free chapters
    }

    return (
        <section className="py-16 px-6 bg-white">
            <h2 className="text-3xl font-bold text-center mb-10">Try for Free</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {chapters.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <ChapterImage chapter={c} />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 bg-green-600 text-[10px] font-black text-white rounded shadow-sm">
                                    FREE
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow text-center">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-primary-600 transition line-clamp-1">{c.title}</h3>
                            <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-4">{c.subjectName}</p>
                            <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">{c.description}</p>
                            <div className="mt-auto">
                                <Link
                                    href={`/chapters/${c.id}`}
                                    className="block w-full py-3 px-4 border-2 border-primary-600 text-primary-600 rounded-lg font-bold text-sm hover:bg-primary-600 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    ENROLL NOW
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
