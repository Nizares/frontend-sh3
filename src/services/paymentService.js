import api from "./api";

export const paymentService = {
    create: (data) => api.post("/payments/create", data),
    getById: (id) => api.get(`/payments/${id}`),
    getHistory: () => api.get("/payments/history"),
};