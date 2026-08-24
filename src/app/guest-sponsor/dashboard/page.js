// src/app/guest-sponsor/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/src/components/Container";
import BatikOverlay from "@/src/components/BatikOverlay";
import { guestSponsorService } from "@/src/services/guestSponsorService";

export default function GuestSponsorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek token
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        if (!token || role !== "guest_sponsor") {
            router.push("/guest-sponsor/login");
            return;
        }

        const fetchData = async () => {
            try {
                const [profileRes, attendanceRes] = await Promise.all([
                    guestSponsorService.getProfile(),
                    guestSponsorService.getMyAttendance(),
                ]);
                setUser(profileRes.data?.data);
                setAttendance(attendanceRes.data?.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("role");
                    router.push("/guest-sponsor/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        router.push("/guest-sponsor/login");
    };

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                    <BatikOverlay />
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-lg">Memuat dashboard...</p>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                <BatikOverlay />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mt-16 mb-8">
                        <h1 className="text-3xl font-bold font-young">Guest Sponsor Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Profile */}
                    {user && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Profil</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Nama</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="font-medium">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sponsor</p>
                                    <p className="font-medium">{user.sponsor?.name || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Event</p>
                                    <p className="font-medium">{user.event?.title || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance History */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Riwayat Attendance</h2>
                        {attendance.length === 0 ? (
                            <p className="text-gray-500">Belum ada riwayat attendance.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left text-sm font-bold">Event</th>
                                            <th className="px-4 py-2 text-left text-sm font-bold">Check In</th>
                                            <th className="px-4 py-2 text-left text-sm font-bold">Check Out</th>
                                            <th className="px-4 py-2 text-left text-sm font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((item) => (
                                            <tr key={item.id} className="border-b">
                                                <td className="px-4 py-2 text-sm">{item.event?.title || "-"}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    {item.check_in_time ? new Date(item.check_in_time).toLocaleString() : "-"}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {item.check_out_time ? new Date(item.check_out_time).toLocaleString() : "-"}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {item.check_in_time ? (
                                                        <span className="text-green-600 font-medium">✓ Hadir</span>
                                                    ) : (
                                                        <span className="text-gray-400">Belum</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}