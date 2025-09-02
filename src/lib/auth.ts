import api from "./api";

export const login = (email: string, password: string) =>
    api.post("/auth/login", { email, password });

export const register = (email: string, password: string, roles: string[], phone?: string) =>
    api.post("/auth/register", { email, phone, password, roles});

export const activateAccount = (token: string, email: string) =>
    api.post("/auth/activate", { email, token });

export const resendActivationToken = (email: string) =>
    api.post("/auth/resend-activation", { email });
