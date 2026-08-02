import api from "./api";

export const sponsorService = {
    getAll: () => api.get("/sponsors"),
};