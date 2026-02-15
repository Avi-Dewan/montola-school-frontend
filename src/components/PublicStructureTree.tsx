"use client";

import { ClassStructureResponseDto, ChapterStatus } from "@/types";
import Link from "next/link";
import { ChevronRight, BookOpen, Lock } from "lucide-react";

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

function BookIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    )
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
                            subject.chapters.map((chapter) => (
                                <Link
                                    key={chapter.id}
                                    href={`/chapters/${chapter.id}`}
                                    className="block p-4 hover:bg-gray-50 transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 rounded-lg text-primary-600 group-hover:bg-primary-100 transition">
                                                <BookIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 group-hover:text-primary-700 transition">
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
