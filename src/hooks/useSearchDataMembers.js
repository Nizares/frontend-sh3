import { useState } from "react";
import useAuth from "./useAuth";
import { profileService } from "@/src/services/profileService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function useSearchDataMembers() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const { loading, login } = useAuth();
    const router = useRouter();

    const requiredFields = [
        { key: "blood_type", label: "Golongan Darah" },
        { key: "emergency_contact", label: "Kontak Darurat" },
        { key: "emergency_phone", label: "Nomor Kontak Darurat" },
        { key: "medical_conditions", label: "Kondisi Medis / Alergi" },
    ];

    async function checkTheID(e) {
        e.preventDefault();
        if (!email || !password) {
            setError("Isi email dan password dulu!");
            return;
        }

        setError(null);
        setUserData(null);

        const user = await login(email, password);

        if (user) {
            // Ambil profile lengkap
            try {
                const profileRes = await profileService.getProfile();
                const profile = profileRes.data.data;
                const participant = profile.participant;

                // Cek kelengkapan data
                const missingFields = requiredFields
                    .filter(field => !participant?.[field.key])
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
                    id: participant?.id,
                    name: profile.user?.name,
                    email: profile.user?.email,
                    telp_number: participant?.phone ?? "-",
                });

            } catch {
                setError("Gagal mengambil data profil.");
            }
        } else {
            setError("Email atau password salah.");
        }
    }

    return {
        loading,
        id: email,
        setId: setEmail,
        password,
        setPassword,
        userData,
        error,
        checkTheID,
    };
}