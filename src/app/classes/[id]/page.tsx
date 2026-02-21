"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClassPublicStructure } from "@/lib/public";
import { ClassStructureResponseDto } from "@/types";
import PublicStructureTree from "@/components/PublicStructureTree";
import ChapterPlaceholder from "@/components/ChapterPlaceholder";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ClassPage() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;

    const [structure, setStructure] = useState<ClassStructureResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchStructure = async () => {
            try {
                const data = await getClassPublicStructure(id);
                setStructure(data);
            } catch (err) {
                console.error("Failed to fetch class structure:", err);
                setError("Failed to load class content.");
            } finally {
                setLoading(false);
            }
        };

        fetchStructure();
    }, [id]);

    if (!id) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <LoadingSpinner label="Fetching class details..." size="lg" />
            </div>
        );
    }

    if (error || !structure) {
        return <div className="min-h-screen pt-24 text-center text-red-500">{error || "Class not found"}</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 overflow-hidden rounded-3xl shadow-xl shadow-gray-200 border border-gray-100">
                    <div className="aspect-[21/9] md:aspect-[3/1] relative">
                        <ChapterPlaceholder title={structure.name} />
                    </div>
                    <div className="bg-white p-8 md:p-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase">{structure.name}</h1>
                        {structure.description && (
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">{structure.description}</p>
                        )}
                    </div>
                </div>

                <PublicStructureTree structure={structure} />
            </div>
        </main>
    );
}
