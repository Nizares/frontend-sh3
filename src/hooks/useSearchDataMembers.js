import { useState } from "react";
import useAuth from "./useAuth";
import { authService } from "@/src/services/authService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function useSearchDataMembers() {
    const [id, setId] = useState(""); // ini untuk username
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const { loading, login } = useAuth();
    const router = useRouter();

    const requiredFields = [
        { key: "blood_type", label: "Golongan Darah" },
        { key: "emergency_contact", label: "Kontak Darurat" },
        { key: "emergency_phone", label: "Nomor Kontak Darurat" },
        { key: "allergy_history", label: "Riwayat Alergi" },
        { key: "identity_number", label: "Nomor KTP/Passport" },
    ];

    async function checkTheID(e) {
        e.preventDefault();
        
        // Validasi
        if (!id || !password) {
            Swal.fire({
                icon: "warning",
                title: "Data Kurang",
                text: "Masukkan Username dan Password dulu!",
            });
            return;
        }

        setError(null);
        setUserData(null);

        // Login dengan username dan password
        const user = await login(id, password);

        if (user) {
            // Ambil profile lengkap
            const profileRes = await authService.getProfile();
            const profile = profileRes.data.data;

            // Cek field yang wajib diisi
            const missingFields = requiredFields
                .filter(field => !profile[field.key])
                .map(field => field.label);

            if (missingFields.length > 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Data Belum Lengkap!",
                    html: `
                        <p>Lengkapi data berikut sebelum daftar event:</p>
                        <ul style="text-align:left; margin-top:8px">
                            ${missingFields.map(f => `<li>❌ ${f}</li>`).join("")}
                        </ul>
                    `,
                    confirmButtonText: "Lengkapi Sekarang",
                    showCancelButton: true,
                    cancelButtonText: "Nanti",
                }).then(result => {
                    if (result.isConfirmed) router.push("/members/detail");
                });
                return;
            }

            setUserData({
                id: user.hash_id,
                name: user.name,
                email: user.email,
                telp_number: user.phone ?? "-",
            });
        } else {
            setError("Username atau password salah.");
            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: "Username atau password salah.",
            });
        }
    }

    return { 
        loading, 
        id, 
        setId, 
        password, 
        setPassword, 
        userData, 
        error, 
        checkTheID 
    };
}