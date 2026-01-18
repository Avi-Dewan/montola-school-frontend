// Authentication types
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    fullName: string;
    roles: string[];
}

export interface User {
    email: string;
    fullName: string;
    roles: string[];
}
