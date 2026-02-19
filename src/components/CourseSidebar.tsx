"use client";

import { ChapterStructureResponseDto, ChapterProgressResponseDto } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaCheckCircle, FaRegCircle, FaPlayCircle, FaFileAlt, FaQuestionCircle } from "react-icons/fa";

interface Props {
    structure: ChapterStructureResponseDto;
    detailedProgress: Record<string, boolean>;
    overallProgress: ChapterProgressResponseDto | null;
}

function StatusIcon({ completed }: { completed: boolean }) {
    if (completed) {
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

export default function CourseSidebar({ structure, detailedProgress, overallProgress }: Props) {
    const params = useParams();
    const currentContentId = params?.contentId ? Number(params.contentId) : null;
    const chapterId = params?.id;

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 hidden md:block">
            <div className="p-5 border-b border-gray-100">
                <Link href="/student/dashboard" className="text-xs font-semibold text-primary-600 hover:text-primary-700 mb-3 flex items-center gap-1 transition-colors">
                    &larr; BACK TO DASHBOARD
                </Link>
                <h2 className="font-bold text-gray-900 leading-tight mb-4" title={structure.title}>{structure.title}</h2>

                {/* Overall Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                        <span>CHAPTER PROGRESS</span>
                        <span className="text-primary-600">
                            {(overallProgress?.progressPercentage ?? 0).toFixed(2)}%
                        </span>

                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-primary-500 h-full transition-all duration-500 ease-out"
                            style={{ width: `${overallProgress?.progressPercentage || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="py-2">
                {structure.topics.map((topic) => {
                    const totalItems = topic.contentItems.length;
                    const completedItems = topic.contentItems.filter(item => detailedProgress[item.id]).length;

                    return (
                        <div key={topic.id} className="mb-2">
                            <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {topic.title}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500">
                                    {completedItems}/{totalItems}
                                </span>
                            </div>
                            <div className="space-y-0.5">
                                {topic.contentItems.map((item) => {
                                    const isActive = currentContentId === item.id;
                                    const isCompleted = !!detailedProgress[item.id];

                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/student/chapters/${chapterId}/content/${item.id}`}
                                            className={`flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-4 ${isActive
                                                ? "bg-primary-50 border-primary-500 text-primary-700 font-bold"
                                                : "border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                                }`}
                                        >
                                            <div className="flex-shrink-0">
                                                <StatusIcon completed={isCompleted} />
                                            </div>
                                            <div className="flex-grow truncate">
                                                {item.title}
                                            </div>
                                            <div className={`flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-gray-300'}`}>
                                                <ContentIcon type={item.type} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

