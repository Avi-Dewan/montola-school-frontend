import api from "./api";

export const login = (email: string, password: string) =>
    api.post("/auth/login", { email, password });

export const register = (email: string, password: string, roles: string[]) =>
    api.post("/auth/register", { email, password, roles });
