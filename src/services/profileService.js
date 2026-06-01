import api from "./api";

export const profileService = {
    getProfile: () => api.get("/participants/me"),
    update: (data) => api.put("/participants/me", data),
    uploadPhoto: (formData) => api.post("/participants/me/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
};