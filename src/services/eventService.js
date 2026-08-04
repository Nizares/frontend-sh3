import api from "./api";

export const eventService = {
    getAll: (params) => api.get("/events", { params }),
    getUpcoming: () => api.get("/events/upcoming"),
    getById: (id) => api.get(`/events/${id}`),
    getParticipants: (id) => api.get(`/events/${id}/participants`),
    registerEvent: (eventId, formData) => api.post(`/events/${eventId}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    getMyEvents: () => api.get("/my-events"), // ← sudah kembali ke /my-events!
};