// src/services/eventService.js
import api from "./api";

export const eventService = {
    /**
     * GET /events - List semua event (public)
     */
    getAll: (params) => api.get("/events", { params }),

    /**
     * GET /events/upcoming - Event yang akan datang (public)
     */
    getUpcoming: () => api.get("/events/upcoming"),

    /**
     * GET /events/{id} - Detail event (public)
     */
    getById: (id) => api.get(`/events/${id}`),

    /**
     * GET /events/{id}/participants - List peserta event (public)
     */
    getParticipants: (id) => api.get(`/events/${id}/participants`),

    /**
     * GET /my-events - Event yang diikuti user (auth)
     */
    getMyEvents: () => api.get("/my-events"),

    /**
     * POST /events/{id}/register - Daftar event (auth)
     * ✅ Tidak perlu body, cukup token
     */
    registerEvent: (eventId) => api.post(`/events/${eventId}/register`),

    /**
     * POST /events/{id}/cancel - Batalkan event (admin)
     */
    cancelEvent: (id) => api.post(`/events/${id}/cancel`),
};