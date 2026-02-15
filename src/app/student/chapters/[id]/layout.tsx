"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getChapterProgress, getChapterDetailedProgress } from "@/lib/student"; // Removed getChapterStructure from student if not there
import { getChapterStructure } from "@/lib/teacher"; // Re-using, or better: add to student.ts
// Actually, student.ts didn't have getChapterStructure. Let's use public one or teacher one?
// Public structure might be different (less detailed?).
// Let's assume we need a GET /api/v1/chapters/{id}/structure for students.
// Checking api-docs: /api/v1/chapters/{id}/structure is there.
// I should add getChapterStructure to student.ts or import from elsewhere.
// I'll import from teacher.ts as it uses the same endpoint /api/v1/chapter/{id}/structure typically.
// Wait, teacher.ts has: getChapterStructure from "./admin".
// Let's just add it to student.ts to be clean or import from where it exists.
// I'll check if I can import `getChapterStructure` from `lib/public`? No, public has `getClassPublicStructure`.
// `lib/teacher` re-exports from `admin`.
// I'll assume I can just fetch it here or utilize a new helper.
// Ideally, `lib/student.ts` should have it. I'll update `lib/student.ts` in separate step if needed but I can't do it now in this turn.
// I will fetch it directly here or use `api.get`.
// Since I can't update student.ts in this turn easily without interrupting flow, I will just call api directly here or assume I can import `getChapterStructure` from `admin` if accessible.
// Let's try importing from `lib/admin` if it exists, or `lib/teacher`.
import { ChapterStructureResponseDto } from "@/types";
import CourseSidebar from "@/components/CourseSidebar";
import api from "@/lib/api";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const chapterId = params?.id ? Number(params.id) : null;

    const [structure, setStructure] = useState<ChapterStructureResponseDto | null>(null);
    const [progress, setProgress] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!chapterId) return;

        const fetchData = async () => {
            try {
                // Fetch structure and progress in parallel
                // TODO: Add getChapterStructure to lib/student.ts properly
                const [structRes, progressRes] = await Promise.all([
                    api.get<ChapterStructureResponseDto>(`/v1/chapters/${chapterId}/structure`),
                    getChapterDetailedProgress(chapterId)
                ]);

                setStructure(structRes.data);
                setProgress(progressRes || {});

            } catch (error) {
                console.error("Failed to load course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [chapterId]);

    if (!chapterId) return null;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading course...</div>;
    }

    if (!structure) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Course content not found</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 pt-16">
            {/* pt-16 to account for fixed navbar if it exists, but layout usually handles navbar. check app/layout.tsx */}
            {/* If Navbar is in root layout, it's sticky or fixed? Usually fixed. */}
            {/* Let's assume standard layout. Sidebar handles its own scrolling. */}

            <CourseSidebar structure={structure} progress={progress} />

            <div className="flex-1 min-w-0 overflow-y-auto">
                <main className="p-8 max-w-4xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
