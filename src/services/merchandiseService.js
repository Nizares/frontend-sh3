import api from "./api";

export const merchandiseService = {
    getAll: (params) => api.get("/merchandise", { params }),
    getById: (id) => api.get(`/merchandise/${id}`),
    order: (data) => api.post("/merchandise/order", data),
    getMyOrders: () => api.get("/merchandise/orders"),
    getOrderById: (id) => api.get(`/merchandise/orders/${id}`),
    cancelOrder: (id) => api.post(`/merchandise/orders/${id}/cancel`),
    uploadPayment: (id, formData) => api.post(`/merchandise/orders/${id}/payment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
};