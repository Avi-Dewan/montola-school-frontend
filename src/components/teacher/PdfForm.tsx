"use client";

import { useState, useEffect } from "react";
import { GooglePdfContentRequestDto } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

interface PdfFormProps {
    topicId: number;
    initialData?: any; // Content response from API
    onSubmit: (data: GooglePdfContentRequestDto, file?: File | null) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function PdfForm({
    topicId,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: PdfFormProps) {
    const [formData, setFormData] = useState<GooglePdfContentRequestDto>({
        topicId: topicId,
        title: initialData?.title || "",
        googleFileId: initialData?.googleFileId || "",
        pageCount: initialData?.pageCount || undefined,
        orderIndex: initialData?.orderIndex || 0,
    });
    const [errors, setErrors] = useState<{ title?: string; googleFileId?: string }>({});
    const [file, setFile] = useState<File | null>(null);
    const isEditing = Boolean(initialData);

    useEffect(() => {
        if (initialData) {
            setFormData({
                topicId: topicId,
                title: initialData.title || "",
                googleFileId: initialData.googleFileId || "",
                pageCount: initialData.pageCount || undefined,
                orderIndex: initialData.orderIndex || 0,
            });
        }
    }, [initialData, topicId]);

    const validate = (): boolean => {
        const newErrors: { title?: string; googleFileId?: string } = {};

        if (!formData.title || formData.title.trim().length === 0) {
            newErrors.title = "PDF title is required";
        } else if (formData.title.length > 255) {
            newErrors.title = "PDF title must be less than 255 characters";
        }

        // Editing may leave the file id blank to keep the current file. A new
        // document needs either an external id or an uploaded file.
        const hasFileId = Boolean(formData.googleFileId && formData.googleFileId.trim().length > 0);
        if (!file && !isEditing && !hasFileId) {
            newErrors.googleFileId = "Provide a Google File ID or upload a file";
        } else if (formData.googleFileId && formData.googleFileId.length > 500) {
            newErrors.googleFileId = "Google File ID must be less than 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit(formData, file);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save PDF");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="PDF Title"
                required
                value={formData.title}
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
                error={errors.title}
                maxLength={255}
                placeholder="Enter PDF title"
            />

            <Input
                label="Google File ID"
                required={!isEditing}
                value={formData.googleFileId}
                onChange={(e) =>
                    setFormData({ ...formData, googleFileId: e.target.value })
                }
                error={errors.googleFileId}
                maxLength={500}
                placeholder={isEditing ? "Leave blank to keep current file" : "Enter Google Drive file ID"}
            />

            <div>
                <label className="block mb-1 font-semibold text-gray-700">
                    Or upload a PDF
                </label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Uploaded files are stored privately and served with the reader&apos;s watermark.
                </p>
            </div>

            <Input
                label="Page Count"
                type="number"
                value={formData.pageCount?.toString() || ""}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        pageCount: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                }
                placeholder="Number of pages (optional)"
            />

            <Input
                label="Order Index"
                type="number"
                required
                value={formData.orderIndex.toString()}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        orderIndex: parseInt(e.target.value) || 0,
                    })
                }
                placeholder="Order index"
            />

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? "Update PDF" : "Create PDF"}
                </Button>
            </div>
        </form>
    );
}
