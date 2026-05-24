import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "./useAuth";

export default function useSearchMembers() {
    const [searchId, setSearchId] = useState("");
    const { loading, error, login } = useAuth();

    function handleChange(e) {
        setSearchId(e.target.value);
    }

    function hidePhone(number, shownNumber = 2) {
        return '*'.repeat(number.length - shownNumber) + number.slice(-shownNumber);
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchId) return;

        const user = await login(searchId);

        if (user) {
            Swal.fire({
                icon: "success",
                title: "Data ditemukan!",
                html: `
                    <p>ID: ${user.hash_id}</p>
                    <p>Nama: ${user.name}</p>
                    <p>Telp: ${hidePhone(user.phone, 2)}</p>
                `,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Data tidak ditemukan",
                text: "Pastikan ID yang kamu masukkan sudah benar.",
            });
        }
    }

    return { loading, searchId, setSearchId, handleSearch, handleChange };
}