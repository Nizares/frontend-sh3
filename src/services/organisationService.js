import api from "./api";

export const organisationService = {
    getAll: (params) => api.get("/organization", { params }),
    getTree: () => api.get("/organization/tree"),
    getStats: () => api.get("/organization/stats"),
    getYears: () => api.get("/organization/years"),
    getById: (id) => api.get(`/organization/${id}`),
};