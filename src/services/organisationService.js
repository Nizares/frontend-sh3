import api from "./api";

export const organisationService = {
    getTree: (year) => api.get("/organisations/tree", { params: { year } }),
    getYears: () => api.get("/organisations/years"),
};