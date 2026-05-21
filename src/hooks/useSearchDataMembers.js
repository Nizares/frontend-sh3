import { useState } from "react";
import useAuth from "./useAuth";

export default function useSearchDataMembers() {
    const [id, setId] = useState("");
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const { loading, login } = useAuth();

    async function checkTheID(e) {
        e.preventDefault();
        if (!id) return;

        setError(null);
        setUserData(null);

        const user = await login(id);

        if (user) {
            setUserData({
                id: user.hash_id,
                name: user.name,
                email: user.email,
                telp_number: user.phone,
            });
        } else {
            setError("Hash ID tidak ditemukan. Pastikan ID kamu benar.");
        }
    }

    return { loading, id, setId, userData, error, checkTheID };
}