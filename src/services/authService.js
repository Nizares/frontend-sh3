import api from "./api";

export const authService = {
    login: (username, password) => api.post("/login", { username, password }), // ← ganti
    logout: () => api.post("/logout"),
    getProfile: () => api.get("/participants/me"),
};