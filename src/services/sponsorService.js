import api from "./api";

export const sponsorService = {
  // Ambil semua sponsor (global, untuk halaman sponsor utama jika diperlukan)
  getAll: (params) => api.get("/sponsors", { params }),

  // Ambil sponsor berdasarkan event ID (embedded di event detail)
  // Note: sponsor sudah masuk dalam response getById event,
  // tapi jika butuh endpoint terpisah, bisa pakai ini
  getByEvent: (eventId) => api.get(`/events/${eventId}/sponsors`),
};