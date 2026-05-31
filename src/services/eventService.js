import api from "./api";

export const eventService = {
  getAll: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  getParticipants: (id) => api.get(`/events/${id}/participants`),
  getMyEvents: () => api.get("/my-events"),
  getMerchandise: (id) => api.get(`/events/${id}/merchandise`),
  book: (id) => api.post(`/events/${id}/book`)
};