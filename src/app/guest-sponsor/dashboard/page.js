// src/app/guest-sponsor/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Container from "@/src/components/Container";
import BatikOverlay from "@/src/components/BatikOverlay";
import { guestSponsorService } from "@/src/services/guestSponsorService";
import QRCode from "qrcode";

export default function GuestSponsorDashboard() {
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrImage, setQrImage] = useState(null);

    useEffect(() => {
        if (!isLoggedIn || user?.role !== "guest_sponsor") {
            router.push("/guest-sponsor/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch attendance
                const response = await guestSponsorService.getMyAttendance();
                setAttendance(response.data?.data || []);

                // Generate QR Code dari user data
                if (user?.qr_code) {
                    const qr = await QRCode.toDataURL(user.qr_code, {
                        width: 300,
                        margin: 2,
                        color: {
                            dark: '#000000',
                            light: '#ffffff',
                        }
                    });
                    setQrImage(qr);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err.response?.status === 401) {
                    logout();
                    router.push("/guest-sponsor/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn, user, router, logout]);

    const handleLogout = () => {
        logout();
        router.push("/guest-sponsor/login");
    };

    console.log(user)

    const handleDownloadQR = () => {
        if (!qrImage) return;
        const link = document.createElement("a");
        link.href = qrImage;
        link.download = `qr-${user?.username || 'guest'}.png`;
        link.click();
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

                    {/* 🔥 QR CODE - Download & ID */}
                    {qrImage && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-2">QR Code Saya</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Download QR Code ini untuk check-in di event
                            </p>
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <img
                                        src={qrImage}
                                        alt="QR Code Guest Sponsor"
                                        className="w-48 h-48"
                                    />
                                </div>
                                
                                {/* 🔥 ID Guest Sponsor */}
                                <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-200 text-center">
                                    <p className="text-xs text-gray-500">ID Guest Sponsor</p>
                                    <p className="text-lg font-mono font-bold text-gray-800">
                                        {user?.qr_code || user?.username || "-"}
                                    </p>
                                </div>

                                <button
                                    onClick={handleDownloadQR}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                >
                                    Download QR
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile */}
                    {user && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Profil</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <p className="font-medium">{user.sponsor_name || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Event</p>
                                    <p className="font-medium">{user.event_title || "-"}</p>
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