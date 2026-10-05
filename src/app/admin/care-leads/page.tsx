"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCareLeads, updateCareLead, deleteCareLead, CareLead } from "@/lib/care";

const STATUSES: CareLead["status"][] = ["NEW", "CONTACTED", "ENROLLED", "CLOSED"];
const STATUS_STYLE: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700",
    CONTACTED: "bg-amber-50 text-amber-700",
    ENROLLED: "bg-primary-50 text-primary-700",
    CLOSED: "bg-gray-100 text-gray-500",
};

export default function AdminCareLeadsPage() {
    const [leads, setLeads] = useState<CareLead[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        getCareLeads().then(setLeads).catch(() => setLeads([])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const setStatus = async (l: CareLead, status: CareLead["status"]) => {
        try { await updateCareLead(l.id, status); load(); }
        catch { toast.error("Update failed."); }
    };
    const remove = async (l: CareLead) => {
        if (!confirm(`Delete lead from ${l.name}?`)) return;
        try { await deleteCareLead(l.id); toast.success("Lead deleted."); load(); }
        catch { toast.error("Delete failed."); }
    };

    const newCount = leads.filter((l) => l.status === "NEW").length;

    return (
        <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Academic Care leads</h1>
            <p className="text-gray-500 text-sm mb-6">{newCount} new · {leads.length} total — free-trial / counseling requests.</p>

            {loading ? (
                <p className="text-gray-500">Loading…</p>
            ) : leads.length === 0 ? (
                <p className="text-gray-500">No leads yet.</p>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Phone</th>
                                <th className="px-4 py-3 font-medium">Level</th>
                                <th className="px-4 py-3 font-medium">Area</th>
                                <th className="px-4 py-3 font-medium">Message</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((l) => (
                                <tr key={l.id} className="border-t border-gray-100 align-top">
                                    <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                                    <td className="px-4 py-3">
                                        <a href={`tel:${l.phone}`} className="text-primary-600 hover:underline">{l.phone}</a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{l.level}</td>
                                    <td className="px-4 py-3 text-gray-600">{l.area || "—"}</td>
                                    <td className="px-4 py-3 text-gray-500 max-w-[220px]">{l.message || "—"}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={l.status}
                                            onChange={(e) => setStatus(l, e.target.value as CareLead["status"])}
                                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer ${STATUS_STYLE[l.status]}`}
                                        >
                                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => remove(l)} className="text-rose-600 hover:underline text-xs font-semibold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
