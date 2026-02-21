"use client";

import { useEffect, useState } from "react";
import { getAllClasses } from "@/lib/public";
import { ClassResponseDto } from "@/types";
import Link from "next/link";
import ChapterPlaceholder from "./ChapterPlaceholder";

export default function ClassesListSection() {
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
        return <div className="py-10 text-center">Loading classes...</div>;
    }

    if (classes.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-6 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-10">Our Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {classes.map((c) => (
                    <Link
                        key={c.id}
                        href={`/classes/${c.id}`}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 block group"
                    >
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <ChapterPlaceholder title={c.name} className="!p-4" />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition uppercase tracking-tight leading-tight mb-2">
                                {c.name}
                            </h3>
                            {c.description && (
                                <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">
                                    {c.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
