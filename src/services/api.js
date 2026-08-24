// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000, // ✅ Tambah timeout
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                
                // ✅ Trigger event untuk komponen
                window.dispatchEvent(new CustomEvent("auth:logout"));
                
                // ❌ HAPUS redirect otomatis
                // Biarkan komponen yang menangani redirect
                // window.location.href = "/members/detail";
            }
        }
        return Promise.reject(error);
    }
);

export default api;