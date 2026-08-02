import api from "./api";

export const memberService = {
    register: (data) => api.post("/auth/register", data),
};