import { useState } from "react";
import { authService } from "@/src/services/authService";

export default function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function login(username, password) { // ← tambah parameter password
        setLoading(true);
        setError(null);
        try {
            const res = await authService.login(username, password);
            const { token, participant } = res.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(participant));
            return participant;
        } catch (err) {
            setError("Username atau password salah.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        authService.logout().catch(() => { }); // tetap logout meski gagal
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