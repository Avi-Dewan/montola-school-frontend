"use client";

import { ClassStructureResponseDto, ChapterStatus } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ChapterPlaceholder from "./ChapterPlaceholder";
import { useAuth } from "@/contexts/AuthContext";
import { getMyChaptersProgress } from "@/lib/student";
import { FaPlay } from "react-icons/fa";

// Using lucide-react icons if available, otherwise consider text fallback or verify icons
// Assuming lucide-react is commonly used or I can use simple SVGs/text
// Checking package.json would be good, but I'll use simple text/emoji or generic svg if I can't verify.
// Actually, I'll use simple SVGs to be safe and avoiding dependency issues if not installed.

function LockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    )
}

function ChapterImageIcon({ chapterId, title }: { chapterId: number, title: string }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-300">
            {!imageError ? (
                <Image
                    src={`http://localhost:8080/api/v1/chapters/${chapterId}/cover-image`}
                    alt={title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                />
            ) : (
                <ChapterPlaceholder
                    title={title}
                    className="!p-0.5"
                    variant="thumbnail"
                />
            )}
        </div>
    );
}

interface Props {
    structure: ClassStructureResponseDto;
}

export default function PublicStructureTree({ structure }: Props) {
    const { isLoggedIn, user } = useAuth();
    const [enrollmentMap, setEnrollmentMap] = useState<Map<number, number>>(new Map());

    const isStudent = user?.roles?.includes("STUDENT");

    useEffect(() => {
        if (isLoggedIn && isStudent) {
            getMyChaptersProgress()
                .then(progress => {
                    if (progress && progress.length > 0) {
                        const emap = new Map();
                        progress.forEach(p => emap.set(p.chapterId, p.progressPercentage));
                        setEnrollmentMap(emap);
                    }
                })
                .catch(err => console.error("Failed to fetch enrollment status:", err));
        }
    }, [isLoggedIn, isStudent]);

    return (
        <div className="space-y-8">
            {structure.subjects.map((subject) => (
                <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800">{subject.name}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {subject.chapters.length === 0 ? (
                            <div className="p-6 text-gray-400 text-center italic">No chapters available yet.</div>
                        ) : (
                            subject.chapters.map((chapter, index) => (
                                <Link
                                    key={chapter.id}
                                    href={enrollmentMap.has(chapter.id) ? `/student/chapters/${chapter.id}` : `/chapters/${chapter.id}`}
                                    className="block p-4 hover:bg-gray-50 transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-grow mr-4">
                                            <ChapterImageIcon chapterId={chapter.id} title={chapter.title} />
                                            <div className="flex-grow">
                                                <p className="font-bold text-gray-900 group-hover:text-primary-600 transition uppercase tracking-tighter text-sm">
                                                    {chapter.title}
                                                </p>
                                                {enrollmentMap.has(chapter.id) && (
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <div className="w-24 bg-gray-100 rounded-full h-1">
                                                            <div
                                                                className="bg-green-500 h-1 rounded-full"
                                                                style={{ width: `${enrollmentMap.get(chapter.id)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                            {Math.round(enrollmentMap.get(chapter.id) || 0)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            {enrollmentMap.has(chapter.id) ? (
                                                <span className="text-[10px] font-black text-white bg-green-600 px-2 py-1 rounded uppercase tracking-tighter shadow-sm">
                                                    RESUME
                                                </span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
