// src/services/membershipService.js
import api from "./api";

export const membershipService = {
    getStatus: () => api.get("/membership"),
    getHistory: () => api.get("/membership/history"),
    getPlans: () => api.get("/membership/plans"),
    
    // 🔥 Subscribe dengan FormData
    subscribe: (formData) => api.post("/membership/subscribe", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    
    cancel: () => api.post("/membership/cancel"),
};