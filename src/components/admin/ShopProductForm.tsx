"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { PRODUCT_TYPE_META } from "@/lib/shopMeta";
import { createProduct, updateProduct, uploadProductFile } from "@/lib/shop";
import type { ShopAdminProduct, ShopLevel, ShopClass } from "@/types/shop";

interface Option { id: number; label: string }

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    product?: ShopAdminProduct | null;
    levels: ShopLevel[];
    classes: ShopClass[];
    subjects: Option[];
    chapters: Option[];
}

const TYPE_OPTIONS = Object.entries(PRODUCT_TYPE_META).map(([value, m]) => ({ value, label: m.label }));

export default function ShopProductForm({ isOpen, onClose, onSaved, product, levels, classes, subjects, chapters }: Props) {
    const editing = !!product;
    const [f, setF] = useState({
        title: product?.title ?? "",
        description: product?.description ?? "",
        type: product?.type ?? "NOTES",
        format: product?.format ?? "PDF",
        price: String(product?.price ?? ""),
        levelId: product?.levelId ? String(product.levelId) : "",
        classId: product?.classId ? String(product.classId) : "",
        subjectId: product?.subjectId ? String(product.subjectId) : "",
        chapterId: product?.chapterId ? String(product.chapterId) : "",
        status: product?.status ?? "DRAFT",
        featured: product?.featured ?? false,
        preview: product?.preview ?? "",
        html: "",
        fileId: "",
        pageCount: "",
    });
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const set = (k: string, v: any) => setF((s) => ({ ...s, [k]: v }));

    /**
     * Interactive content is markup, not a file, so an uploaded .html simply fills
     * the HTML box — the admin can review it, and saving then works exactly as if
     * it had been pasted.
     */
    const handleHtmlFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        // Allow re-picking the same file, which otherwise fires no change event.
        e.target.value = "";

        if (!picked) return;

        try {
            set("html", await picked.text());
        } catch {
            toast.error("Could not read that file.");
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!f.title.trim()) return toast.error("Title is required.");
        setLoading(true);

        const payload: any = {
            title: f.title.trim(),
            description: f.description.trim(),
            type: f.type,
            format: f.format,
            price: Number(f.price) || 0,
            levelId: f.levelId ? Number(f.levelId) : null,
            classId: f.classId ? Number(f.classId) : null,
            subjectId: f.subjectId ? Number(f.subjectId) : null,
            chapterId: f.chapterId ? Number(f.chapterId) : null,
            status: f.status,
            featured: f.featured,
            preview: f.preview.trim(),
        };
        // only send content if the admin actually entered some (avoids wiping on edit)
        if (f.format === "INTERACTIVE" && f.html.trim()) payload.content = { html: f.html };
        if (f.format === "PDF" && f.fileId.trim()) payload.content = { fileId: f.fileId.trim(), pageCount: Number(f.pageCount) || 0 };

        try {
            // The upload endpoint is keyed by product id, so the product has to exist
            // before its file can be attached.
            const saved = editing ? await updateProduct(product!.id, payload) : await createProduct(payload);

            if (file) {
                try {
                    await uploadProductFile(saved.id, file);
                } catch (uploadErr: any) {
                    // The product was saved but has no file. Say so explicitly,
                    // otherwise the admin assumes the save failed and creates a duplicate.
                    toast.error(
                        uploadErr.response?.data?.message
                            || "Product saved, but the PDF upload failed. Re-open the product and upload again."
                    );
                    onSaved();
                    onClose();
                    return;
                }
            }

            toast.success(editing ? "Product updated." : "Product created.");
            onSaved();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Save failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editing ? "Edit product" : "New product"} size="lg">
            <form onSubmit={submit} className="p-1">
                <Input label="Title" value={f.title} onChange={(e) => set("title", e.target.value)} required />

                <div className="mb-4">
                    <label className="block mb-1 font-semibold text-gray-700">Description</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                        value={f.description}
                        onChange={(e) => set("description", e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select label="Type" value={f.type} onChange={(e) => set("type", e.target.value)} options={TYPE_OPTIONS} />
                    <Select label="Format" value={f.format} onChange={(e) => set("format", e.target.value)}
                        options={[{ value: "PDF", label: "PDF" }, { value: "INTERACTIVE", label: "Interactive" }]} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select label="Level" value={f.levelId} onChange={(e) => { set("levelId", e.target.value); set("classId", ""); }}
                        options={[{ value: "", label: "— none —" }, ...levels.map((l) => ({ value: String(l.id), label: l.name }))]} />
                    <Select label="Class" value={f.classId} onChange={(e) => set("classId", e.target.value)}
                        options={[
                            { value: "", label: "— none (level-wide) —" },
                            ...(f.levelId ? classes.filter((c) => c.levelId === Number(f.levelId)) : classes)
                                .map((c) => ({ value: String(c.id), label: c.name })),
                        ]} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select label="Subject" value={f.subjectId} onChange={(e) => set("subjectId", e.target.value)}
                        options={[{ value: "", label: "— none —" }, ...subjects.map((s) => ({ value: String(s.id), label: s.label }))]} />
                    <Select label="Chapter" value={f.chapterId} onChange={(e) => set("chapterId", e.target.value)}
                        options={[{ value: "", label: "— none —" }, ...chapters.map((c) => ({ value: String(c.id), label: c.label }))]} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Price (৳)" type="number" value={f.price} onChange={(e) => set("price", e.target.value)} />
                    <Select label="Status" value={f.status} onChange={(e) => set("status", e.target.value)}
                        options={[{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }]} />
                </div>

                <label className="flex items-center gap-2 mb-4 text-gray-700">
                    <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
                    Featured (show on shop home & featured row)
                </label>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold text-gray-700">Preview text</label>
                    <textarea className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2} value={f.preview} onChange={(e) => set("preview", e.target.value)} />
                </div>

                {f.format === "INTERACTIVE" ? (
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-gray-700">Content (HTML)</label>
                        <textarea className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={4} placeholder={editing ? "Leave blank to keep existing content" : "<h2>…</h2>"}
                            value={f.html} onChange={(e) => set("html", e.target.value)} />

                        <label className="block mt-3 mb-1 font-semibold text-gray-700">Or upload an .html file</label>
                        <input
                            type="file"
                            accept=".html,.htm,text/html"
                            onChange={handleHtmlFile}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            The file's markup fills the box above, so it can be checked before saving.
                        </p>
                    </div>
                ) : (
                    <>
                        {editing && product?.fileAttached && (
                            <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                                <p className="text-xs font-semibold text-green-800">Attached file</p>
                                <p className="mt-0.5 break-all font-mono text-[11px] text-green-900">
                                    {product.fileId || "reference not available"}
                                </p>
                                <p className="mt-1 text-[11px] text-green-800">
                                    Shown for reference and not resubmitted. Pick a new file below to replace it.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="External file id" placeholder={editing ? "Leave empty to keep the current reference" : "e.g. a Google Drive file id"} value={f.fileId} onChange={(e) => set("fileId", e.target.value)} />
                            <Input label="Page count" type="number" value={f.pageCount} onChange={(e) => set("pageCount", e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-semibold text-gray-700">Or upload a PDF</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Stored in the configured bucket and served from there, instead of the file id above.
                            </p>
                        </div>
                    </>
                )}

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>{editing ? "Save changes" : "Create product"}</Button>
                </div>
            </form>
        </Modal>
    );
}
