import api from "./api";

export const orderService = {
  create: (event_id, participant_id) => api.post("/orders", { event_id, participant_id }),
  uploadPayment: (orderId, formData) =>
    api.post(`/orders/${orderId}/upload-payment`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};