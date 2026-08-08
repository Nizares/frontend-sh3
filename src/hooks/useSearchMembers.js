import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "./useAuth";
import { useAuth as useAuthContext } from "@/src/contexts/AuthContext";

export default function useSearchMembers() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState(null);
    const { loading, error, login } = useAuth();
    const { setAuthUser } = useAuthContext();

    function handleChange(e) { 
        setUsername(e.target.value); 
    }
    
    function handlePasswordChange(e) { 
        setPassword(e.target.value); 
    }

    async function handleSearch(e) {
        e.preventDefault();
        
        if (!username || !password) {
            Swal.fire({ 
                icon: "warning", 
                title: "Isi username dan password dulu!" 
            });
            return;
        }

        const user = await login(username, password);
        
        if (user) {
            setUserData(user);
            setAuthUser(user);
            Swal.fire({
                icon: "success",
                title: "Login Berhasil!",
                html: `<p>Selamat datang, <strong>${user.name}</strong>!</p>`,
                timer: 2000,
                showConfirmButton: false,
            });
        } else {
            setUserData(null);
            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: error || "Username atau password salah.",
            });
        }
    }

    return {
        loading,
        searchId: username,      // ← username
        setSearchId: setUsername,
        password,
        handlePasswordChange,
        handleSearch,
        handleChange,
        userData,
        setUserData,
    };
}