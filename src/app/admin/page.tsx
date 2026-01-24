"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStatistics } from "@/lib/admin";
import { AdminStatisticsDto } from "@/types";
import { toast } from "react-toastify";
import { HiBookOpen, HiLibrary, HiDocumentText, HiClock } from "react-icons/hi";
import RoleToggle from "@/components/admin/RoleToggle";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStatisticsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getStatistics();
                setStats(res.data);
            } catch (err: any) {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to load statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading statistics...</p>
                </div>
            </div>
        );
    }

    const statsCards = [
        {
            title: "Total Classes",
            value: stats?.courseStats.totalClasses || 0,
            icon: HiBookOpen,
            color: "bg-blue-500",
            href: "/admin/classes",
        },
        {
            title: "Total Subjects",
            value: stats?.courseStats.totalSubjects || 0,
            icon: HiLibrary,
            color: "bg-green-500",
            href: "/admin/subjects",
        },
        {
            title: "Total Chapters",
            value: stats?.courseStats.totalChapters || 0,
            icon: HiDocumentText,
            color: "bg-purple-500",
            href: "/admin/chapters",
        },
        {
            title: "Draft Chapters",
            value: stats?.chapterStats.totalDraft || 0,
            icon: HiClock,
            color: "bg-yellow-500",
            href: "/admin/chapters?status=DRAFT",
        },
        {
            title: "Published Chapters",
            value: stats?.chapterStats.totalPublished || 0,
            icon: HiDocumentText,
            color: "bg-green-600",
            href: "/admin/chapters?status=PUBLISHED",
        },
        {
            title: "Free Chapters",
            value: stats?.chapterStats.totalFree || 0,
            icon: HiDocumentText,
            color: "bg-primary-500",
            href: "/admin/chapters",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => router.push(card.href)}
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* User Statistics Section */}
            {stats?.userStats && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">User Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-500">{stats.userStats.totalUsers}</p>
                            <p className="text-sm text-gray-600 mt-1">Total Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-500">{stats.userStats.activeUsers}</p>
                            <p className="text-sm text-gray-600 mt-1">Active Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">{stats.userStats.admins}</p>
                            <p className="text-sm text-gray-600 mt-1">Admins</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-500">{stats.userStats.managers}</p>
                            <p className="text-sm text-gray-600 mt-1">Managers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-500">{stats.userStats.teachers}</p>
                            <p className="text-sm text-gray-600 mt-1">Teachers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-700">{stats.userStats.students}</p>
                            <p className="text-sm text-gray-600 mt-1">Students</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => router.push("/admin/classes?action=create")}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Create New Class
                    </button>
                    <button
                        onClick={() => router.push("/admin/subjects?action=create")}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Create New Subject
                    </button>
                    <button
                        onClick={() => router.push("/admin/chapters?action=create")}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Create New Chapter
                    </button>
                    <button
                        onClick={() => router.push("/admin/payments/unverified")}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        View Unverified Payments
                    </button>
                </div>
            </div>
        </div>
    );
}
