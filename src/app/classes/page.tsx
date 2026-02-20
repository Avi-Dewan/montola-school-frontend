"use client";

import { useEffect, useState } from "react";
import { getAllClasses } from "@/lib/public";
import { ClassResponseDto } from "@/types";
import Link from "next/link";
import { FaGraduationCap, FaChevronRight } from "react-icons/fa";

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getAllClasses();
                setClasses(data);
            } catch (err) {
                console.error("Failed to fetch classes:", err);
                setError("Failed to load classes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="text-gray-500 font-medium">Loading classes...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Available Classes</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our comprehensive curriculum and join the class that matches your educational goals.
                    </p>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl text-center max-w-md mx-auto">
                        {error}
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <FaGraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No classes found</h3>
                        <p className="text-gray-500">We're still setting up our course catalog. Please check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {classes.map((cls) => (
                            <Link
                                key={cls.id}
                                href={`/classes/${cls.id}`}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:border-primary-500 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500 ease-out" />

                                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                    <FaGraduationCap size={28} />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                    {cls.name}
                                </h2>

                                <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                                    {cls.description || "Discover the curated curriculum and resources available for this academic level."}
                                </p>

                                <div className="flex items-center gap-2 text-primary-600 font-bold group-hover:gap-3 transition-all duration-300">
                                    View Subject List <FaChevronRight size={14} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
