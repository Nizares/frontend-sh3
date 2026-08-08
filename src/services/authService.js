// src/services/authService.js
import api from "./api";

export const authService = {
    // 🔥 Login dengan username
    login: (username, password) => api.post("/auth/login", { username, password }),
    
    register: (data) => api.post("/auth/register", data),
    logout: () => api.post("/auth/logout"),
    me: () => api.get("/auth/me"),
    refresh: () => api.post("/auth/refresh"),
    forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
    resetPassword: (data) => api.post("/auth/reset-password", data),
};