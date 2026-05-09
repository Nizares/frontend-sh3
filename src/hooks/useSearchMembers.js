import Swal from "sweetalert2";
import { useState } from "react";

const dummyUsers = [
    { id: "SH3ID000001", name: "Sukoshi Dake", telp_number: "081245121313", email: "sukouko12@gmail.com" },
    { id: "SH3ID000002", name: "Afureru Antze", telp_number: "081245121445", email: "afureru32@gmail.com" },
    { id: "SH3ID000003", name: "Ryo Yamada", telp_number: "081245121071", email: "ryobassist67@gmail.com" },
]


export default function useSearchMembers() {
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState("");

    function handleChange(e) {
        setSearchId(e.target.value)
    }

    function hidePhone(number, shownNumber = 4) {
        // return number.slice(0, shownNumber) + '*'.repeat(number.length - shownNumber); // 4 nomor diawal
        return '*'.repeat(number.length - shownNumber) + number.slice(-shownNumber); // 4 nomor diakhir
    }

    async function handleSearch(e) {
        e.preventDefault();
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {

            const result = dummyUsers.find((item) => {
                return item.id.toUpperCase() === searchId.toUpperCase()
            })
            Swal.fire({
                icon: "success",
                title: "Data ditemukan!",
                html: `
                        <p>ID: ${result.id}</p>
                        <p>Nama: ${result.name}</p>
                        <p>Telp: ${hidePhone(result.telp_number, 4)}</p>
                    `,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Data tidak ditemukan",
                text: "Pastikan ID yang kamu masukkan sudah benar.",
            });
        } finally {
            setLoading(false);
        }
    }
    return {
        loading, searchId, setSearchId, handleSearch, handleChange
    }
}