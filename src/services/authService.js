import api from "./api";

export const authService = {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (data) => api.post("/auth/register", data),
    logout: () => api.post("/auth/logout"),
    me: () => api.get("/auth/me"),
    refreshToken: () => api.post("/auth/refresh"),
    forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
    resetPassword: (data) => api.post("/auth/reset-password", data),
};