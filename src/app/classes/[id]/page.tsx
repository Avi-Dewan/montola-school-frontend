"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClassPublicStructure } from "@/lib/public";
import { ClassStructureResponseDto } from "@/types";
import PublicStructureTree from "@/components/PublicStructureTree";

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
        return <div className="min-h-screen pt-24 text-center">Loading class details...</div>;
    }

    if (error || !structure) {
        return <div className="min-h-screen pt-24 text-center text-red-500">{error || "Class not found"}</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{structure.name}</h1>
                    {structure.description && (
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{structure.description}</p>
                    )}
                </div>

                <PublicStructureTree structure={structure} />
            </div>
        </main>
    );
}
