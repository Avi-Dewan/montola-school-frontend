"use client";

import { useEffect, useState } from "react";
import { getFeaturedChapters } from "@/lib/public";
import { FeaturedChapterResponseDto } from "@/types";
import Link from "next/link";

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
                    <div key={c.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col">
                        <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{c.subjectName} • {c.className}</p>
                        <p className="text-gray-700 mb-4 line-clamp-2">{c.description}</p>
                        <div className="mt-auto">
                            <p className="text-green-600 font-semibold mb-4">
                                {c.free ? "Free" : `৳${c.price}`}
                            </p>
                            <Link
                                href={`/chapters/${c.chapterId}`}
                                className="block w-full text-center py-2 px-4 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
                            >
                                Preview
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
