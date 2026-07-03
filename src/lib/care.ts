import api from "./api";

export interface CareLead {
    id: number;
    name: string;
    phone: string;
    level: string;
    area: string;
    message: string;
    status: "NEW" | "CONTACTED" | "ENROLLED" | "CLOSED";
    createdAt: string;
}

// ---- Public ----
export const submitCareLead = async (data: {
    name: string; phone: string; level?: string; area?: string; message?: string;
}) => {
    const res = await api.post("/v1/care/leads", data);
    return res.data;
};

// ---- Admin ----
export const getCareLeads = async () => {
    const res = await api.get<CareLead[]>("/v1/care/admin/leads");
    return res.data;
};

export const updateCareLead = async (id: number, status: CareLead["status"]) => {
    const res = await api.put<CareLead>(`/v1/care/admin/leads/${id}`, { status });
    return res.data;
};

export const deleteCareLead = async (id: number) => {
    await api.delete(`/v1/care/admin/leads/${id}`);
};
