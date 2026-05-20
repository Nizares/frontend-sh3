import api from "./api";

export const authService = {
  login: (hash_id) => api.post("/login", { hash_id }),
  logout: () => api.post("/logout"),
  getProfile: () => api.get("/profile"),
};