"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    getAllChapters,
    getChaptersByStatus,
    createChapter,
    updateChapter,
    deleteChapter,
} from "@/lib/admin";
import { ChapterResponseDto, ChapterRequestDto, ChapterStatus } from "@/types";
import DataTable, { Column } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ChapterForm from "@/components/admin/ChapterForm";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { HiPlus, HiPencil, HiTrash, HiEye } from "react-icons/hi";

export default function ChaptersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [chapters, setChapters] = useState<ChapterResponseDto[]>([]);
    const [filteredChapters, setFilteredChapters] = useState<ChapterResponseDto[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | "">("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState<ChapterResponseDto | null>(
        null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchChapters();
        
        // Check if we need to open modal for create
        if (searchParams.get("action") === "create") {
            setIsModalOpen(true);
        }
        
        // Check for status filter in URL
        const statusParam = searchParams.get("status");
        if (statusParam) {
            setSelectedStatus(statusParam);
        }
    }, [searchParams]);

    useEffect(() => {
        let filtered = chapters;

        if (selectedStatus) {
            filtered = filtered.filter((c) => c.status === selectedStatus);
        }

        if (selectedSubjectId) {
            filtered = filtered.filter((c) => c.subjectId === selectedSubjectId);
        }

        setFilteredChapters(filtered);
    }, [chapters, selectedStatus, selectedSubjectId]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const res = await getAllChapters();
            setChapters(res.data);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to load chapters");
        } finally {
            setLoading(false);
        }
    };


    const handleCreate = () => {
        setEditingChapter(null);
        setIsModalOpen(true);
    };

    const handleEdit = (chapter: ChapterResponseDto) => {
        setEditingChapter(chapter);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteChapter(id);
            toast.success("Chapter deleted successfully");
            fetchChapters();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete chapter");
        }
    };

    const handleSubmit = async (data: ChapterRequestDto) => {
        setIsSubmitting(true);
        try {
            if (editingChapter) {
                await updateChapter(editingChapter.id, data);
                toast.success("Chapter updated successfully");
            } else {
                await createChapter(data);
                toast.success("Chapter created successfully");
            }
            setIsModalOpen(false);
            setEditingChapter(null);
            fetchChapters();
        } catch (err: any) {
            throw err; // Let form handle the error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingChapter(null);
        router.replace("/admin/chapters", undefined);
    };

    const getStatusBadge = (status: ChapterStatus) => {
        const badges = {
            [ChapterStatus.DRAFT]: "bg-yellow-100 text-yellow-800",
            [ChapterStatus.PUBLISHED]: "bg-green-100 text-green-800",
            [ChapterStatus.ARCHIVED]: "bg-gray-100 text-gray-800",
        };
        return badges[status] || badges[ChapterStatus.DRAFT];
    };

    // Get subject name - use subjectName directly from API response
    const getSubjectName = (chapter: ChapterResponseDto) => {
        return chapter.subjectName || `Subject ${chapter.subjectId}`;
    };

    // Get unique subjects from chapters data (using enriched subjectName field)
    const getUniqueSubjects = () => {
        const subjectMap = new Map<number, { id: number; name: string }>();
        chapters.forEach((chapter) => {
            if (chapter.subjectId && chapter.subjectName) {
                subjectMap.set(chapter.subjectId, {
                    id: chapter.subjectId,
                    name: chapter.subjectName,
                });
            }
        });
        return Array.from(subjectMap.values());
    };

    const columns: Column<ChapterResponseDto>[] = [
        {
            key: "id",
            header: "ID",
            sortable: true,
        },
        {
            key: "title",
            header: "Title",
            sortable: true,
        },
        {
            key: "subjectId",
            header: "Subject",
            sortable: true,
            render: (item) => (
                <span className="text-gray-700">{getSubjectName(item)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            render: (item) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                        item.status
                    )}`}
                >
                    {item.status}
                </span>
            ),
        },
        {
            key: "price",
            header: "Price",
            sortable: true,
            render: (item) => (
                <span className="text-gray-600">
                    {item.free ? (
                        <span className="text-green-600 font-medium">Free</span>
                    ) : (
                        `৳${item.price || 0}`
                    )}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/chapters/${item.id}`);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                    >
                        <HiEye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                        }}
                        className="p-1 text-primary-500 hover:bg-primary-50 rounded transition-colors"
                        title="Edit"
                    >
                        <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <HiTrash className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Chapter Management</h1>
                <Button onClick={handleCreate} variant="primary">
                    <HiPlus className="w-5 h-5 inline-block mr-1" />
                    Create New Chapter
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Status:
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Statuses</option>
                            <option value={ChapterStatus.DRAFT}>Draft</option>
                            <option value={ChapterStatus.PUBLISHED}>Published</option>
                            <option value={ChapterStatus.ARCHIVED}>Archived</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Subject:
                        </label>
                        <select
                            value={selectedSubjectId}
                            onChange={(e) =>
                                setSelectedSubjectId(
                                    e.target.value === ""
                                        ? ""
                                        : Number(e.target.value)
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Subjects</option>
                            {getUniqueSubjects().map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <DataTable
                data={filteredChapters}
                columns={columns}
                keyExtractor={(item) => item.id}
                onRowClick={(item) => router.push(`/admin/chapters/${item.id}`)}
                loading={loading}
                emptyMessage="No chapters found. Create your first chapter to get started."
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingChapter ? "Edit Chapter" : "Create New Chapter"}
                size="lg"
            >
                <ChapterForm
                    initialData={editingChapter || undefined}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    isLoading={isSubmitting}
                />
            </Modal>
        </div>
    );
}
