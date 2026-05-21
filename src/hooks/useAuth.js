import { useState } from "react";
import { authService } from "@/src/services/authService";

export default function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function login(hash_id) {
        setLoading(true);
        setError(null);
        try {

            const res = await authService.login(hash_id);
            console.log("Full response:", res.data);
            const { token, participant } = res.data.data;
            console.log("participant:", participant);

            // Simpan token & data user ke localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(participant));

            return participant; // kembalikan data user
        } catch (err) {
            setError("Hash ID tidak ditemukan. Pastikan ID kamu benar.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        authService.logout().catch(() => {}); // tetap logout meski gagal
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    function getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    function isLoggedIn() {
        return !!localStorage.getItem("token");
    }

    return { loading, error, login, logout, getUser, isLoggedIn };
}