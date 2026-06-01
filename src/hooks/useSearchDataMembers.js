import { useState } from "react";
import useAuth from "./useAuth";
import { authService } from "@/src/services/authService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function useSearchDataMembers() {
    const [id, setId] = useState("");
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
        if (!id) return;

        setError(null);
        setUserData(null);

        // Step 1: Login dulu dapat token
        const user = await login(id);

        if (user) {
            // Step 2: Ambil data lengkap dari GET /profile
            const profileRes = await authService.getProfile();
            const profile = profileRes.data.data;

            // Step 3: Cek kelengkapan data
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
                        <p style="margin-top:8px; font-size:0.9rem; color:gray">
                            Lengkapi di halaman <b>Member → Cek Member</b>
                        </p>
                    `,
                    confirmButtonText: "Lengkapi Sekarang",
                    showCancelButton: true,
                    cancelButtonText: "Nanti",
                }).then(result => {
                    if (result.isConfirmed) {
                        router.push("/members/detail");
                    }
                });
                return;
            }

            // Step 4: Data lengkap, isi form
            setUserData({
                id: user.hash_id,
                name: profile.name,
                email: profile.email,
                telp_number: profile.phone ?? "-",
            });

        } else {
            setError("Hash ID tidak ditemukan. Pastikan ID kamu benar.");
        }
    }

    return { loading, id, setId, userData, error, checkTheID };
}