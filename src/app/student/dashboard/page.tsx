"use client";

import { useEffect, useState } from "react";
import { getMyChaptersProgress } from "@/lib/student";
import { ChapterProgressResponseDto } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { FaBookOpen, FaAward, FaClock } from "react-icons/fa";
import ChapterPlaceholder from "@/components/ChapterPlaceholder";

// Simple Icons
function CourseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.516 50.552 50.552 0 00-2.658.813m-15.482 0A50.553 50.553 0 0112 13.489a50.551 50.551 0 0112-1.586m-22.5 5.152l6.75-6.75a4.5 4.5 0 016.368 6.366l-9 9h9a2.25 2.25 0 002.25-2.25v-9.37l6.75-6.75" />
        </svg>
    )
}

function ChapterImage({ item }: { item: ChapterProgressResponseDto }) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <ChapterPlaceholder title={item.chapterTitle} />;
    }

    return (
        <Image
            src={`http://localhost:8080/api/v1/chapters/${item.chapterId}/cover-image`}
            alt={item.chapterTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            unoptimized
        />
    );
}

export default function StudentDashboard() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [progressData, setProgressData] = useState<ChapterProgressResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await getMyChaptersProgress();
                setProgressData(data);
            } catch (error) {
                console.error("Failed to fetch progress:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProgress();
        } else if (!isAuthLoading) {
            setLoading(false);
        }
    }, [user, isAuthLoading]);

    if (loading || isAuthLoading) {
        return <div className="min-h-screen pt-24 text-center">Loading dashboard...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <p className="text-xl mb-4">Please log in to view your dashboard.</p>
                <Link href="/auth/login" className="text-primary-600 underline">Login</Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName?.split(" ")[0]}! 👋</h1>
                    <p className="text-gray-600 mt-2">Pick up where you left off.</p>
                </header>

                {progressData.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-dashed border-gray-300">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CourseIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't enrolled in any courses yet.</h3>
                        <p className="text-gray-500 mb-6">Explore our catalog to start learning.</p>
                        <Link
                            href="/"
                            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {progressData.map((item) => (
                            <Link
                                key={item.chapterId}
                                href={`/student/chapters/${item.chapterId}`}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 block group"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gray-100">
                                    <ChapterImage item={item} />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute top-3 right-3">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded shadow-sm flex items-center gap-1 ${item.completed ? 'bg-green-500 text-white' : 'bg-primary-600 text-white'}`}>
                                            {item.completed ? <FaAward /> : <FaClock />}
                                            {item.completed ? "COMPLETED" : "IN PROGRESS"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1">{item.chapterTitle}</h3>
                                        <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                                            {item.progressPercentage === 100 ? "Finished" : "Continue Learning"}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500 font-medium">Your Progress</span>
                                            <span className="font-black text-primary-600">{Math.round(item.progressPercentage)}%</span>
                                        </div>

                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-primary-600 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${item.progressPercentage}%` }}
                                            />
                                        </div>

                                        <div className="pt-2 flex items-center justify-end">
                                            <span className="text-sm font-black text-primary-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                {item.completed ? "REVIEW" : "RESUME"} &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
