import { useState } from "react";
const dummyUsers = [
    { id: "SH3ID000001", name: "Sukoshi Dake", telp_number: "081245121313", email: "sukouko12@gmail.com" },
    { id: "SH3ID000002", name: "Afureru Antze", telp_number: "081245121445", email: "afureru32@gmail.com" },
    { id: "SH3ID000003", name: "Ryo Yamada", telp_number: "081245121071", email: "ryobassist67@gmail.com" },
]

export default function useSearchDataMembers () {
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState("");
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");

    async function checkTheID(e) {
        e.preventDefault();
        setLoading(true);
        
        const foundId = dummyUsers.find(user => user.id === id);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (foundId) {
            setUserData(foundId);
            setError("");
            setLoading(false);
        } else {
            setUserData(null);
            setError("Data tidak ditemukan");
            setLoading(false);
        }
    } 
    return {
        loading, id, setId, userData, error, checkTheID
    };
}