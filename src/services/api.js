// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL, // ✅ dari .env
  headers: { "Content-Type": "application/json" },
});

export default api;