"use client";

import { useEffect, useState } from "react";
import { getFreeChapters } from "@/lib/public";
import { ChapterResponseDto } from "@/types";
import Link from "next/link";

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
                    <div key={c.id} className="border p-5 rounded-lg hover:shadow-md transition flex flex-col">
                        <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{c.subjectName}</p>
                        <p className="text-gray-700 mb-4 line-clamp-3 text-sm">{c.description}</p>
                        <div className="mt-auto pt-4">
                            <Link
                                href={`/chapters/${c.id}`}
                                className="block w-full text-center py-2 px-4 border border-primary-500 text-primary-500 rounded hover:bg-primary-50 transition"
                            >
                                Enroll Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
