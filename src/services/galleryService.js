import api from "./api";

export const galleryService = {
    getAll: (params) => api.get("/galleries", { params }),
};