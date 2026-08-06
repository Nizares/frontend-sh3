// src/services/galleryService.js
import api from "./api";

export const galleryService = {
    /**
     * GET /galleries - List semua gallery (public)
     * @param {Object} params - Query params (optional)
     */
    getAll: (params = {}) => {
        return api.get("/galleries", { params });
    },

    /**
     * GET /galleries/{id} - Detail gallery (jika ada)
     */
    getById: (id) => {
        return api.get(`/galleries/${id}`);
    },
};