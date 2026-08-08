import { useState } from "react";
import { authService } from "@/src/services/authService";
import { profileService } from "@/src/services/profileService";
import api from "@/src/services/api";
import { useAuth as useAuthContext } from "@/src/contexts/AuthContext";

export default function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setAuthUser } = useAuthContext();

    // 🔥 LOGIN DENGAN USERNAME (bukan email)
    async function login(username, password) {
        setLoading(true);
        setError(null);
        try {
            const res = await authService.login(username, password);
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Flatten user + participant jadi 1 object
            const participant = user.participants?.[0] ?? {};
            const fullUser = {
                ...user,
                participant_id: participant.id,
                phone: participant.phone,
                gender: participant.gender,
                date_of_birth: participant.date_of_birth,
                address: participant.address,
                blood_type: participant.blood_type,
                jersey_size: participant.jersey_size,
                emergency_contact: participant.emergency_contact,
                emergency_phone: participant.emergency_phone,
                medical_conditions: participant.medical_conditions,
            };

            localStorage.setItem("user", JSON.stringify(fullUser));
            setAuthUser(fullUser);
            return fullUser;

        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.username?.[0]
                || "Username atau password salah.";
            setError(msg);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete api.defaults.headers.common['Authorization'];
            setAuthUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        authService.logout().catch(() => {});
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common['Authorization'];
        setAuthUser(null);
    }

    function getUser() {
        if (typeof window === "undefined") return null;
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    function isLoggedIn() {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem("token");
    }

    return { loading, error, login, logout, getUser, isLoggedIn };
}