// src/services/galleryService.js
import api from "./api";
export const galleryService = {
    getAll: (params = {}) => {
        return api.get("/galleries", { params });
    },

    /**
     * GET /gallery-albums - List semua album (public)
     * Baru di backend 2026-08-19
     */
    getAlbums: (params = {}) => {
        return api.get("/gallery-albums", { params });
    },

    /**
     * GET /gallery-albums/{id} - Detail album + semua media
     * Baru di backend 2026-08-20
     */
    getAlbumDetail: (id) => {
        return api.get(`/gallery-albums/${id}`);
    },
};