"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getContentById, markContentComplete, submitQuizScore } from "@/lib/student";
import {
    LectureResponseDto,
    QuizResponseDto,
    GooglePdfContentResponseDto,
    QuizQuestionResponseDto,
    QuizQuestionType
} from "@/types";
import {
    FiCheckCircle,
    FiXCircle,
    FiChevronRight,
    FiFileText,
    FiPlay,
    FiHelpCircle,
    FiAlertCircle
} from "react-icons/fi";
import { toast } from "react-toastify";


export default function ContentPlayerPage() {
    const params = useParams();
    const router = useRouter();
    const contentId = params?.contentId ? Number(params.contentId) : null;
    const chapterId = params?.id ? Number(params.id) : null;

    const [content, setContent] = useState<LectureResponseDto | QuizResponseDto | GooglePdfContentResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const fetchContent = useCallback(async () => {
        if (!contentId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getContentById(contentId);
            setContent(data);
        } catch (err: any) {
            console.error("Failed to fetch content", err);
            if (err.response?.status === 403) {
                setError(err.response.data?.message || "You don't have permission to access this content.");
            } else if (err.response?.status === 404) {
                setError("Content not found.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, [contentId]);

    useEffect(() => {
        fetchContent();
        // Reset quiz state when content changes
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(0);
    }, [fetchContent]);

    const handleMarkComplete = async () => {
        if (!contentId) return;
        try {
            await markContentComplete(contentId);
            toast.success("Marked as complete!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to mark as complete");
        }
    };

    const handleQuizSubmit = async () => {
        if (!content || !('questions' in content)) return;

        let totalMarks = 0;
        let earnedMarks = 0;

        content.questions.forEach((q) => {
            totalMarks += q.marks;
            const answer = quizAnswers[q.id];

            if (q.type === QuizQuestionType.MULTIPLE_CHOICE) {
                const correctOptionIds = q.options.filter(o => o.isCorrect).map(o => o.id);
                const selectedOptionIds = Array.isArray(answer) ? answer : [answer];

                const isCorrect = correctOptionIds.length === selectedOptionIds.length &&
                    correctOptionIds.every(id => selectedOptionIds.includes(id));

                if (isCorrect) earnedMarks += q.marks;
            } else if (q.type === QuizQuestionType.FILL_IN_THE_BLANK) {
                const isCorrect = q.fillBlanks.every(fb =>
                    answer?.[fb.blankPosition]?.trim().toLowerCase() === fb.correctAnswer.trim().toLowerCase()
                );
                if (isCorrect) earnedMarks += q.marks;
            } else if (q.type === QuizQuestionType.MATCHING) {
                const isCorrect = q.tableMatchings.every(tm =>
                    answer?.[tm.id] === tm.rightItem
                );
                if (isCorrect) earnedMarks += q.marks;
            }
            // Written questions are not auto-graded for now
        });

        setQuizScore(earnedMarks);
        setQuizSubmitted(true);

        try {
            await submitQuizScore(contentId!, earnedMarks);
            toast.success(`Quiz submitted! Your score: ${earnedMarks}/${totalMarks}`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to save quiz results");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-500">Loading your content...</p>
        </div>
    );

    if (error) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-6">
                <FiAlertCircle size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">{error}</p>
            <button
                onClick={() => router.back()}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Go Back
            </button>
        </div>
    );

    if (!content) return <div className="p-8 text-center text-gray-500">Content not found</div>;

    const isLecture = 'videoId' in content;
    const isQuiz = 'questions' in content;
    const isPdf = 'googleFileId' in content;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {isLecture && <FiPlay className="text-blue-600" size={18} />}
                            {isQuiz && <FiHelpCircle className="text-purple-600" size={18} />}
                            {isPdf && <FiFileText className="text-red-600" size={18} />}
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                {isLecture ? "Lecture" : isQuiz ? "Quiz" : "Reference PDF"}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{content.title}</h1>
                    </div>

                </div>

                <div className="p-0 md:p-8">
                    {/* Render Content Based on Type */}
                    {isLecture && (
                        <div className="space-y-6">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                                {content.videoId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${content.videoId}?modestbranding=1&rel=0&showinfo=0`}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No video available
                                    </div>
                                )}
                            </div>
                            {content.content && (
                                <div className="prose prose-blue max-w-none p-6 md:p-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lecture Summary</h3>
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {content.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isPdf && (
                        <div className="space-y-6 p-6 md:p-0">
                            <div className="aspect-[4/5] md:aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                                <iframe
                                    src={`https://drive.google.com/file/d/${content.googleFileId}/preview`}
                                    className="w-full h-full border-0"
                                    allow="autoplay"
                                />
                            </div>
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                        <FiFileText size={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">{content.title}</p>
                                        <p className="text-sm text-blue-700">{content.pageCount} Pages</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isQuiz && (
                        <div className="p-6 md:p-0 space-y-8">
                            {content.instruction && (
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <h3 className="text-sm font-bold text-purple-900 uppercase tracking-tight mb-1">Instructions</h3>
                                    <p className="text-purple-800 text-sm">{content.instruction}</p>
                                </div>
                            )}

                            <div className="space-y-12">
                                {content.questions.map((q, idx) => (
                                    <div key={q.id} className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">{q.questionText}</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase">{q.marks} Marks • {q.type.replace(/_/g, ' ')}</p>
                                            </div>
                                        </div>

                                        {/* Multiple Choice Rendering */}
                                        {q.type === QuizQuestionType.MULTIPLE_CHOICE && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                                {q.options.map((opt) => {
                                                    const isSelected = Array.isArray(quizAnswers[q.id])
                                                        ? quizAnswers[q.id].includes(opt.id)
                                                        : quizAnswers[q.id] === opt.id;

                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            disabled={quizSubmitted}
                                                            onClick={() => {
                                                                const current = quizAnswers[q.id];
                                                                const isMultiple = q.options.filter(o => o.isCorrect).length > 1;

                                                                if (isMultiple) {
                                                                    const arr = Array.isArray(current) ? [...current] : [];
                                                                    if (arr.includes(opt.id)) {
                                                                        setQuizAnswers({ ...quizAnswers, [q.id]: arr.filter(id => id !== opt.id) });
                                                                    } else {
                                                                        setQuizAnswers({ ...quizAnswers, [q.id]: [...arr, opt.id] });
                                                                    }
                                                                } else {
                                                                    setQuizAnswers({ ...quizAnswers, [q.id]: opt.id });
                                                                }
                                                            }}
                                                            className={`text-left p-4 rounded-xl border-2 transition-all ${quizSubmitted
                                                                ? opt.isCorrect
                                                                    ? "border-green-500 bg-green-50 text-green-900"
                                                                    : isSelected
                                                                        ? "border-red-500 bg-red-50 text-red-900"
                                                                        : "border-gray-100 bg-white opacity-50"
                                                                : isSelected
                                                                    ? "border-primary-600 bg-primary-50 text-primary-900"
                                                                    : "border-gray-100 bg-white hover:border-gray-300"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary-600 bg-primary-600" : "border-gray-300"
                                                                    }`}>
                                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                                </div>
                                                                <span className="font-medium">{opt.optionText}</span>
                                                                {quizSubmitted && opt.isCorrect && <FiCheckCircle size={16} className="ml-auto text-green-600" />}
                                                                {quizSubmitted && isSelected && !opt.isCorrect && <FiXCircle size={16} className="ml-auto text-red-600" />}
                                                            </div>

                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Table Matching Rendering */}
                                        {q.type === QuizQuestionType.MATCHING && (
                                            <div className="pl-12 space-y-3">
                                                {q.tableMatchings.map((tm) => (
                                                    <div key={tm.id} className="flex flex-col md:flex-row md:items-center gap-4">
                                                        <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 font-medium">
                                                            {tm.leftItem}
                                                        </div>
                                                        <div className="hidden md:block text-gray-300">
                                                            <FiChevronRight />
                                                        </div>

                                                        <select
                                                            disabled={quizSubmitted}
                                                            value={quizAnswers[q.id]?.[tm.id] || ""}
                                                            onChange={(e) => setQuizAnswers({
                                                                ...quizAnswers,
                                                                [q.id]: { ...(quizAnswers[q.id] || {}), [tm.id]: e.target.value }
                                                            })}
                                                            className={`flex-1 p-3 rounded-lg border-2 bg-white appearance-none transition-all ${quizSubmitted
                                                                ? quizAnswers[q.id]?.[tm.id] === tm.rightItem
                                                                    ? "border-green-500 bg-green-50 text-green-900"
                                                                    : "border-red-500 bg-red-50 text-red-900"
                                                                : "border-gray-100 focus:border-primary-500 outline-none"
                                                                }`}
                                                        >
                                                            <option value="">Select match</option>
                                                            {/* We collect all right items and shuffle/present them */}
                                                            {q.tableMatchings.map(item => (
                                                                <option key={item.id} value={item.rightItem}>{item.rightItem}</option>
                                                            ))}
                                                        </select>
                                                        {quizSubmitted && (
                                                            <div className="text-xs font-bold whitespace-nowrap">
                                                                {quizAnswers[q.id]?.[tm.id] === tm.rightItem
                                                                    ? <span className="text-green-600">Correct</span>
                                                                    : <span className="text-red-600">Ans: {tm.rightItem}</span>
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Fill in the Blanks Rendering */}
                                        {q.type === QuizQuestionType.FILL_IN_THE_BLANK && (
                                            <div className="pl-12">
                                                <div className="leading-loose text-lg text-gray-800 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                                    {q.questionText.split('______').map((part, i, arr) => (
                                                        <span key={i}>
                                                            {part}
                                                            {i < arr.length - 1 && (
                                                                <div className="inline-block mx-2 relative group">
                                                                    <input
                                                                        type="text"
                                                                        disabled={quizSubmitted}
                                                                        placeholder="...."
                                                                        value={quizAnswers[q.id]?.[i + 1] || ""}
                                                                        onChange={(e) => setQuizAnswers({
                                                                            ...quizAnswers,
                                                                            [q.id]: { ...(quizAnswers[q.id] || {}), [i + 1]: e.target.value }
                                                                        })}
                                                                        className={`w-32 md:w-48 px-2 py-0 border-b-2 text-center bg-transparent focus:outline-none transition-all ${quizSubmitted
                                                                            ? quizAnswers[q.id]?.[i + 1]?.trim().toLowerCase() === q.fillBlanks.find(fb => fb.blankPosition === i + 1)?.correctAnswer.trim().toLowerCase()
                                                                                ? "border-green-500 text-green-700"
                                                                                : "border-red-500 text-red-700"
                                                                            : "border-gray-400 focus:border-primary-500"
                                                                            }`}
                                                                    />
                                                                    {quizSubmitted && (
                                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-sm text-xs font-bold text-green-600 border border-green-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            Ans: {q.fillBlanks.find(fb => fb.blankPosition === i + 1)?.correctAnswer}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Written Question Rendering */}
                                        {q.type === QuizQuestionType.WRITTEN && (
                                            <div className="pl-12 space-y-4">
                                                <textarea
                                                    disabled={quizSubmitted}
                                                    rows={4}
                                                    placeholder="Type your answer here..."
                                                    value={quizAnswers[q.id] || ""}
                                                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                                                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary-500 outline-none transition-all resize-none"
                                                />
                                                {quizSubmitted && q.writtenAnswer && (
                                                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                                                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-tight mb-2">Sample Answer</h4>
                                                        <p className="text-blue-800 text-sm italic">{q.writtenAnswer.sampleAnswer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!quizSubmitted && (
                                <div className="pt-8 border-t border-gray-100 flex justify-center">
                                    <button
                                        onClick={handleQuizSubmit}
                                        className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200 active:transform active:scale-95"
                                    >
                                        Submit Assessment
                                    </button>
                                </div>
                            )}

                            {quizSubmitted && (
                                <div className="bg-gray-900 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-1">Results Calculated</h3>
                                        <p className="text-gray-400">Your score has been recorded and the lesson marked as complete.</p>
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black text-primary-400">
                                        {quizScore} <span className="text-xl text-gray-500">/ {content.totalMarks}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions for non-quizzes or after submission */}
                {(!isQuiz || quizSubmitted) && (
                    <div className="bg-gray-50 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            {isQuiz ? "Quiz results submitted." : "Finished this lesson?"}
                        </div>
                        <div className="flex gap-3">
                            {!isQuiz && (
                                <button
                                    onClick={handleMarkComplete}
                                    className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Mark as Complete
                                </button>
                            )}
                            <button
                                onClick={() => router.back()}
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition font-medium flex items-center gap-2"
                            >
                                Next Lesson <FiChevronRight size={18} />
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

