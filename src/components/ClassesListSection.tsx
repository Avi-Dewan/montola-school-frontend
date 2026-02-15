"use client";

import { useEffect, useState } from "react";
import { getAllClasses } from "@/lib/public";
import { ClassResponseDto } from "@/types";
import Link from "next/link";

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
                        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center group"
                    >
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition">
                            {/* Simple icon placeholder */}
                            <span className="text-2xl font-bold">{c.name.charAt(0)}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition">{c.name}</h3>
                        {c.description && <p className="text-gray-500 text-sm line-clamp-2">{c.description}</p>}
                    </Link>
                ))}
            </div>
        </section>
    );
}
