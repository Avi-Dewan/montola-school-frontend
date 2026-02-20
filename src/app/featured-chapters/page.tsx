"use client";

import { useEffect, useState } from "react";
import { getFeaturedChapters } from "@/lib/public";
import { FeaturedChapterResponseDto } from "@/types";
import Link from "next/link";
import { FaStar, FaChevronRight } from "react-icons/fa";

export default function FeaturedChaptersPage() {
    const [chapters, setChapters] = useState<FeaturedChapterResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const data = await getFeaturedChapters();
                setChapters(data);
            } catch (err) {
                console.error("Failed to fetch featured chapters:", err);
                setError("Failed to load featured chapters.");
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        <FaStar /> CURATED SELECTIONS
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Featured Chapters</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Elevate your learning with our most popular and highly-rated lessons, handpicked by our expert educators.
                    </p>
                </header>

                {error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center max-w-md mx-auto border border-red-100">
                        {error}
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <FaStar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No featured chapters yet</h3>
                        <p className="text-gray-500">Check back soon for our top picks!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chapters.map((c) => (
                            <div key={c.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-1 rounded">
                                            {c.subjectName} {c.className && `[${c.className}]`}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{c.title}</h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">{c.description}</p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <p className="text-xl font-extrabold text-green-600">
                                            {c.free ? "FREE" : `৳${c.price}`}
                                        </p>
                                        <Link
                                            href={`/chapters/${c.chapterId}`}
                                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition"
                                        >
                                            Preview <FaChevronRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
