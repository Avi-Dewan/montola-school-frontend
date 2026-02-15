"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { markContentComplete } from "@/lib/student";
import Link from "next/link";
// We need to fetch content details. "getContentById" exists in teacher.ts.
// I should add it to student.ts or import it.
// Checking previous steps, I didn't add it to student.ts. I will call api directly for now.
import api from "@/lib/api";

export default function ContentPlayerPage() {
    const params = useParams();
    const contentId = params?.contentId ? Number(params.contentId) : null;

    const [content, setContent] = useState<any>(null); // TODO: Type this properly
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contentId) return;

        const fetchContent = async () => {
            try {
                const res = await api.get(`/v1/contents/${contentId}`);
                setContent(res.data);

                // Auto-mark complete for now on load (simple logic)
                // In reality, do this on video end or manual button
                // markContentComplete(contentId); 
            } catch (error) {
                console.error("Failed to fetch content", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [contentId]);

    const handleMarkComplete = async () => {
        if (!contentId) return;
        try {
            await markContentComplete(contentId);
            // Refresh sidebar progress? Context or Refetch typically needed.
            // For now just toast or UI update
            alert("Marked as complete!");
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) return <div>Loading content...</div>;
    if (!content) return <div>Content not found</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
                <p className="text-gray-500 text-sm">{content.type}</p>
            </div>

            <div className="p-8 min-h-[400px]">
                {/* Render Content Based on Type */}
                {content.type === "LECTURE" && (
                    <div className="aspect-video bg-black flex items-center justify-center text-white">
                        {content.videoId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${content.videoId}`}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        ) : (
                            <p>Video Placeholder</p>
                        )}
                    </div>
                )}

                {content.type === "PDF" && (
                    <div className="text-center py-20 bg-gray-50 border border-dashed rounded-lg">
                        <p>PDF Content Viewer Placeholder</p>
                        <a href="#" className="text-primary-600 underline">Download PDF</a>
                    </div>
                )}

                {/* Default text content */}
                {content.content && (
                    <div className="mt-6 prose">
                        <p>{content.content}</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 px-8 py-4 flex justify-end">
                <button
                    onClick={handleMarkComplete}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Mark as Complete
                </button>
            </div>
        </div>
    );
}
