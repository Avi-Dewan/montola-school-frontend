import api from "./api";

export const login = (email: string, password: string) =>
    api.post("/auth/login", { email, password });

export const register = (email: string, password: string, roles: string[], phone?: string) =>
    api.post("/auth/register", { email, phone, password, roles});

export const activateAccount = (email: string, token: string) =>
    api.post("/auth/activate", { email, token });

export const resendActivationToken = (email: string) =>
    api.post("/auth/resend-activation", { email });

export const logout = () => {
    // Option 1: If backend supports logout API (token blacklist / refresh revoke)
    // return api.post("/auth/logout");

    // Option 2: If using JWT (stateless), just remove local storage/session
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return Promise.resolve();
};