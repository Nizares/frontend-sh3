import api from "./api";

export const authService = {
    login: (username, password) => api.post("/login", { username, password }),
    logout: () => api.post("/logout"),
    getProfile: () => api.get("/participants/me"),
};