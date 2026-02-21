"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChapterPublicDetails } from "@/lib/public";
import { getChapterProgress, enrollInFreeChapter, getPaymentStatusForChapter, submitPayment as submitPaymentApi } from "@/lib/student";
import { ChapterResponseDto, ChapterProgressResponseDto, PaymentResponseDto, PaymentStatus, PaymentRequestDto } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaPlayCircle, FaCheckCircle, FaLock, FaUsers, FaHourglassHalf, FaExclamationTriangle } from "react-icons/fa";
import PaymentModal from "@/components/student/PaymentModal";

export default function ChapterPublicPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn, user, isLoading: isAuthLoading } = useAuth();
    const id = params?.id ? Number(params.id) : null;

    const [chapter, setChapter] = useState<ChapterResponseDto | null>(null);
    const [progress, setProgress] = useState<ChapterProgressResponseDto | null>(null);
    const [payment, setPayment] = useState<PaymentResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const isStudent = user?.roles?.includes("STUDENT");

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const chapterData = await getChapterPublicDetails(id);
                setChapter(chapterData);

                // If logged in as student, check enrollment/progress and payment status
                if (isLoggedIn && isStudent) {
                    try {
                        const [progressData, paymentData] = await Promise.all([
                            getChapterProgress(id).catch(() => null),
                            getPaymentStatusForChapter(id).catch(() => null)
                        ]);

                        if (progressData) setProgress(progressData);
                        if (paymentData) setPayment(paymentData as PaymentResponseDto);
                    } catch (err) {
                        console.error("Failed to fetch student progress/payment:", err);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch chapter details:", err);
                toast.error("Failed to load chapter details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isLoggedIn, isStudent]);

    const handleEnroll = async () => {
        if (!chapter) return;

        if (!isLoggedIn) {
            toast.info("You need to login first to enroll.");
            router.push(`/auth/login?returnUrl=/chapters/${chapter.id}`); // Assuming login supports returnUrl
            return;
        }

        if (chapter.free) {
            setEnrolling(true);
            try {
                await enrollInFreeChapter(chapter.id);
                toast.success("Enrolled successfully!");
                // Re-fetch progress to show "Continue" button
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error("Enrollment failed:", error);
                toast.error("Failed to enroll. Please try again.");
            } finally {
                setEnrolling(false);
            }
        } else {
            // Paid chapter
            if (!isLoggedIn) {
                toast.info("You need to login first to purchase.");
                router.push(`/auth/login?returnUrl=/chapters/${chapter.id}`);
                return;
            }
            // Open payment modal
            setIsPaymentModalOpen(true);
        }
    };

    const handlePaymentSubmit = async (data: PaymentRequestDto) => {
        try {
            await submitPaymentApi(data);
            toast.success("Payment submitted successfully! Waiting for verification.");
            // Refresh payment status
            const status = await getPaymentStatusForChapter(chapter!.id);
            if (status) setPayment(status as PaymentResponseDto);
            setIsPaymentModalOpen(false);
        } catch (error) {
            console.error("Payment submission failed:", error);
            toast.error("Failed to submit payment details.");
        }
    };

    if (loading || isAuthLoading) {
        return <div className="min-h-screen pt-24 text-center">Loading chapter details...</div>;
    }

    if (!chapter) {
        return <div className="min-h-screen pt-24 text-center text-red-500">Chapter not found</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                    {/* Visual Section */}
                    <div className="md:w-1/2 relative bg-gray-900 group">
                        {chapter.videoId ? (
                            <div className="aspect-video w-full h-full min-h-[300px]">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${chapter.videoId}`}
                                    title="Chapter Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="relative aspect-video w-full h-full min-h-[300px]">
                                <Image
                                    src={`http://localhost:8080/api/v1/chapters/${chapter.id}/cover-image`}
                                    alt={chapter.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        // Fallback if image fails
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                        )}
                        {!chapter.videoId && (
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
                                    <FaPlayCircle className="text-primary-600" />
                                    PREVIEW
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-10 md:w-1/2 flex flex-col justify-center bg-white">
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <Link
                                href="/classes"
                                className="px-3 py-1 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-full text-xs font-bold tracking-tight transition-colors"
                            >
                                {chapter.className || "General"}
                            </Link>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-tight">
                                {chapter.subjectName}
                            </span>
                        </div>

                        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight uppercase tracking-tight">
                            {chapter.title}
                        </h1>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            {chapter.description || "Master this topic with our expert-led chapter tutorials, exclusive resources, and interactive quizzes."}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans">Instructors</p>
                                <div className="flex flex-wrap gap-1 items-center">
                                    <FaUsers className="text-gray-400" size={14} />
                                    <p className="font-bold text-gray-800 text-sm">
                                        {chapter.teachers && chapter.teachers.length > 0
                                            ? chapter.teachers.map(t => t.fullName).join(", ")
                                            : "Montola Faculty"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans">
                                    {chapter.free ? "Status" : "Price"}
                                </p>
                                <p className="text-2xl font-black text-primary-600">
                                    {chapter.free ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `৳${chapter.price || 0}`
                                    )}
                                </p>
                            </div>
                        </div>

                        {progress ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-700">Progress</span>
                                        <span className="text-sm font-black text-primary-600">{Math.round(progress.progressPercentage)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-primary-600 h-full transition-all duration-1000"
                                            style={{ width: `${progress.progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <Link
                                    href={`/student/chapters/${chapter.id}`}
                                    className="block w-full text-center py-4 bg-primary-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-primary-200 hover:bg-primary-700 transition transform hover:-translate-y-1"
                                >
                                    CONTINUE LEARNING
                                </Link>
                            </div>
                        ) : payment && payment.status === PaymentStatus.PENDING ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center space-y-4">
                                <FaHourglassHalf className="mx-auto text-blue-500 text-3xl" />
                                <div>
                                    <p className="text-lg font-bold text-blue-900 leading-tight">Verification Pending</p>
                                    <p className="text-sm text-blue-700 mt-1">Please wait for admin to verify your payment. This usually takes less than 24 hours.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {payment && payment.status === PaymentStatus.REJECTED && (
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 mb-2">
                                        <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                                        <p className="text-xs font-medium text-red-700">
                                            Your previous payment was rejected. Please resubmit the payment info.
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3 ${chapter.free
                                        ? "bg-green-600 text-white hover:bg-green-700 shadow-green-100"
                                        : "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100"
                                        } ${enrolling ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {enrolling ? (
                                        "PROCESSING..."
                                    ) : (
                                        <>
                                            {chapter.free ? <FaPlayCircle /> : <FaCheckCircle />}
                                            {chapter.free ? "ENROLL NOW" : (payment && payment.status === PaymentStatus.REJECTED ? "RESUBMIT PAYMENT INFO" : "BUY THIS CHAPTER")}
                                        </>
                                    )}
                                </button>
                                {chapter.free && !isLoggedIn && (
                                    <div className="flex items-center justify-center gap-2 text-gray-400 bg-gray-50 py-2 rounded-xl">
                                        <FaLock size={12} />
                                        <p className="text-xs font-bold uppercase tracking-widest">Login required to access</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {chapter && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    chapterId={chapter.id}
                    chapterTitle={chapter.title}
                    amount={chapter.price || 0}
                    onSubmit={handlePaymentSubmit}
                />
            )}

            {/* Additional Details Section could go here */}
            <div className="max-w-5xl mx-auto mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                {/* Fallback content or fetch from structure? For public details, usually descriptive text is enough */}
                <p className="text-gray-600">{chapter.description || "Detailed curriculum not available publicly."}</p>
            </div>

        </main>
    );
}
