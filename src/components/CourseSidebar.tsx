"use client";

import { ChapterStructureResponseDto, TopicStructureResponseDto, ContentItemStructureResponseDto } from "@/types";
import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FaChevronDown, FaChevronRight, FaCheckCircle, FaRegCircle, FaPlayCircle, FaFileAlt, FaQuestionCircle } from "react-icons/fa";

interface Props {
    structure: ChapterStructureResponseDto;
    progress: Record<string, string>; // contentId -> status
}

function StatusIcon({ status }: { status?: string }) {
    if (status === "COMPLETED") {
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <FaRegCircle className="w-4 h-4 text-gray-300" />;
}

function ContentIcon({ type }: { type: string }) {
    switch (type) {
        case "LECTURE": return <FaPlayCircle className="w-4 h-4" />;
        case "PDF": return <FaFileAlt className="w-4 h-4" />;
        case "QUIZ": return <FaQuestionCircle className="w-4 h-4" />;
        default: return <FaRegCircle className="w-4 h-4" />;
    }
}

export default function CourseSidebar({ structure, progress }: Props) {
    const params = useParams();
    const pathname = usePathname();
    const currentContentId = params?.contentId ? Number(params.contentId) : null;
    const chapterId = params?.id;

    // Default expand all or expand current
    // Simple implementation: all expanded for now

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 h-screen overflow-y-auto sticky top-0 hidden md:block">
            <div className="p-4 border-b border-gray-200">
                <Link href="/student/dashboard" className="text-sm text-gray-500 hover:text-gray-900 mb-2 block">
                    &larr; Back to Dashboard
                </Link>
                <h2 className="font-bold text-gray-900 truncate" title={structure.title}>{structure.title}</h2>
            </div>

            <div className="py-2">
                {structure.topics.map((topic) => (
                    <div key={topic.id} className="mb-1">
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {topic.title}
                        </div>
                        <div>
                            {topic.contentItems.map((item) => {
                                const isActive = currentContentId === item.id;
                                const status = progress[item.id] || "NOT_STARTED";

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/student/chapters/${chapterId}/content/${item.id}`}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm transition border-l-2 ${isActive
                                            ? "bg-primary-50 border-primary-500 text-primary-700 font-medium"
                                            : "border-transparent hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        <div className="flex-shrink-0">
                                            <StatusIcon status={status} />
                                        </div>
                                        <div className="flex-grow truncate">
                                            {item.title}
                                        </div>
                                        <div className={`flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-gray-400'}`}>
                                            <ContentIcon type={item.type} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
