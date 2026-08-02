import api from "./api";

export const eventService = {
    getAll: (params) => api.get("/events", { params }),
    getUpcoming: () => api.get("/events/upcoming"),
    getById: (id) => api.get(`/events/${id}`),
    registerEvent: (eventId) => api.post(`/events/${eventId}/register`),
    getMyEvents: (participantId) => api.get(`/participants/${participantId}/events`),
};