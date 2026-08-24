// src/app/guest-sponsor/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/src/components/Container";
import BatikOverlay from "@/src/components/BatikOverlay";
import { guestSponsorService } from "@/src/services/guestSponsorService";
import Swal from "sweetalert2";

export default function GuestSponsorLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await guestSponsorService.login(username, password);
            const { token, user } = response.data;

            // Simpan token dan user
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", "guest_sponsor");

            Swal.fire({
                icon: "success",
                title: "Login Berhasil!",
                text: `Selamat datang, ${user?.name || "Guest Sponsor"}`,
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                router.push("/guest-sponsor/dashboard");
            });
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Username atau password salah");
            Swal.fire({
                icon: "error",
                title: "Login Gagal!",
                text: err.response?.data?.message || "Username atau password salah",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                <BatikOverlay />
                <div className="flex justify-center items-center min-h-screen px-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold font-young">Guest Sponsor</h1>
                            <p className="text-gray-500 text-sm mt-2">Login untuk akses attendance event</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Masukkan username"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold text-white transition ${
                                    loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {loading ? "Memproses..." : "Login"}
                            </button>
                        </form>

                        <p className="text-xs text-gray-400 text-center mt-6">
                            Akun guest sponsor dibuat oleh admin SH3.
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}