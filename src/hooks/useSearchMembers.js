import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "./useAuth";
import { useAuth as useAuthContext } from "@/src/contexts/AuthContext";

export default function useSearchMembers() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState(null);
    const { loading, error, login } = useAuth();
    const { setAuthUser } = useAuthContext();

    function handleChange(e) { setEmail(e.target.value); }
    function handlePasswordChange(e) { setPassword(e.target.value); }

    async function handleSearch(e) {
        e.preventDefault();
        if (!email || !password) {
            Swal.fire({ icon: "warning", title: "Isi email dan password dulu!" });
            return;
        }

        const user = await login(email, password);
        if (user) {
            setUserData(user);
            setAuthUser(user);
            Swal.fire({
                icon: "success",
                title: "Login Berhasil!",
                html: `<p>Selamat datang, <strong>${user.name}</strong>!</p>`,
            });
        } else {
            setUserData(null);
            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: error || "Email atau password salah.",
            });
        }
    }

    return {
        loading,
        searchId: email,
        setSearchId: setEmail,
        password,
        handlePasswordChange,
        handleSearch,
        handleChange,
        userData,
        setUserData,
    };
}