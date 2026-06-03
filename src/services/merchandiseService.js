import api from "./api";
 
export const merchandiseService = {
    // Public
    getAll: (params) => api.get("/merchandise", { params }),
    getById: (id) => api.get(`/merchandise/${id}`),
    getCategories: () => api.get("/merchandise/categories"),
 
    // Auth
    createOrder: (data) => api.post("/merchandise/order", data),
    uploadPayment: (orderId, formData) =>
        api.post(`/merchandise/orders/${orderId}/upload-payment`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    getMyOrders: () => api.get("/merchandise/my-orders"),
    getOrderDetail: (id) => api.get(`/merchandise/orders/${id}`),
    cancelOrder: (id) => api.post(`/merchandise/orders/${id}/cancel`),
};