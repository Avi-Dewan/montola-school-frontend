"use client";

import { ClassStructureResponseDto, ChapterStatus } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ChapterPlaceholder from "./ChapterPlaceholder";

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
                                    href={`/chapters/${chapter.id}`}
                                    className="block p-4 hover:bg-gray-50 transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <ChapterImageIcon chapterId={chapter.id} title={chapter.title} />
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-primary-600 transition uppercase tracking-tighter text-sm">
                                                    {chapter.title}
                                                </p>
                                                {/* Status or other metadata could go here */}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* You could add a 'Free' badge or 'Locked' icon here if you had that data in structure */}

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
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
