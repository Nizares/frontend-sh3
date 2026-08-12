"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import InputType from "@/src/components/Inputs";
import BatikOverlay from "@/src/components/BatikOverlay";
import { EyeIcon, EyeSlashIcon, ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { authService } from "@/src/services/authService";
import { useAuth } from "@/src/contexts/AuthContext";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // 🔥 Form state
    const [identifier, setIdentifier] = useState(""); // email atau username
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
    
    const [errors, setErrors] = useState({});

    // 🔥 VALIDASI
    const validate = () => {
        const newErrors = {};
        
        if (!identifier) {
            newErrors.identifier = "Email atau username wajib diisi.";
        }
        if (!newPassword) {
            newErrors.newPassword = "Password baru wajib diisi.";
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Password baru minimal 6 karakter.";
        }
        if (newPassword !== newPasswordConfirm) {
            newErrors.newPasswordConfirm = "Konfirmasi password tidak cocok.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 🔥 SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            // 🔥 Kirim request ganti password ke API
            // Sesuaikan payload dengan kebutuhan backend
            const response = await authService.changePassword({
                email: identifier, // atau username: identifier
                password: newPassword,
                password_confirmation: newPasswordConfirm,
            });
            
            Swal.fire({
                icon: "success",
                title: "Password Berhasil Diubah!",
                text: "Password kamu sudah diperbarui.",
                confirmButtonText: "OK",
            }).then(() => {
                // Redirect ke profile
                router.push("/members/detail");
            });
            
        } catch (err) {
            console.error("Change password error:", err.response?.data);
            
            const errorData = err.response?.data;
            
            if (errorData?.errors) {
                const formattedErrors = {};
                Object.keys(errorData.errors).forEach((key) => {
                    formattedErrors[key] = errorData.errors[key][0];
                });
                setErrors(formattedErrors);
            } else if (errorData?.message) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: errorData.message,
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Terjadi kesalahan, coba lagi nanti.",
                    confirmButtonText: "OK",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Jika user sudah login, isi identifier dengan email/username user
    useEffect(() => {
        if (user) {
            setIdentifier(user.email || user.username || "");
        }
    }, [user]);

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover min-h-screen">
                <BatikOverlay />
                <div className="px-4 md:px-0 max-w-306 mx-auto py-8">
                    
                    {/* Back Button */}
                    <RevealSection direction="up">
                        <Link href="/members/detail" className="inline-flex items-center gap-2 text-neutral-dark hover:text-primary-text transition-colors mt-8">
                            <ArrowLongLeftIcon className="w-6 h-6" />
                            <span>Kembali ke Profil</span>
                        </Link>
                    </RevealSection>

                    {/* Header */}
                    <RevealSection direction="up">
                        <div className="flex flex-col items-center justify-center mt-8 mb-8">
                            <h1 className="text-4xl font-bold font-young text-primary-darker">
                                Ganti Password
                            </h1>
                            <p className="text-neutral-dark mt-2">
                                Masukkan email/username dan password baru untuk mengganti password.
                            </p>
                        </div>
                    </RevealSection>

                    {/* Form */}
                    <RevealSection direction="up">
                        <div className="max-w-md mx-auto bg-primary-light border-2 border-neutral-normal rounded-lg p-6 md:p-8 shadow-lg">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                
                                {/* Email atau Username */}
                                <InputType
                                    label="Email atau Username"
                                    id="identifier"
                                    type="text"
                                    name="identifier"
                                    required
                                    placeholder="email@example.com atau username"
                                    className="flex flex-col gap-2"
                                    value={identifier}
                                    onChange={(e) => {
                                        setIdentifier(e.target.value);
                                        setErrors({});
                                    }}
                                    error={errors.identifier}
                                />

                                {/* New Password */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-lg">
                                        Password Baru <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setErrors({});
                                            }}
                                            placeholder="Minimal 6 karakter"
                                            className={`outline-2 p-3 bg-white outline-tertiary-normal rounded-md w-full pr-12 ${
                                                errors.newPassword ? "border-red-500 outline-red-500" : ""
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showNewPassword ? (
                                                <EyeSlashIcon className="w-5 h-5" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm">{errors.newPassword}</p>
                                    )}
                                    <p className="text-xs text-neutral-dark">
                                        Password minimal 6 karakter.
                                    </p>
                                </div>

                                {/* Confirm New Password */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-lg">
                                        Konfirmasi Password Baru <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type={showNewPasswordConfirm ? "text" : "password"}
                                            value={newPasswordConfirm}
                                            onChange={(e) => {
                                                setNewPasswordConfirm(e.target.value);
                                                setErrors({});
                                            }}
                                            placeholder="Ulangi password baru"
                                            className={`outline-2 p-3 bg-white outline-tertiary-normal rounded-md w-full pr-12 ${
                                                errors.newPasswordConfirm ? "border-red-500 outline-red-500" : ""
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showNewPasswordConfirm ? (
                                                <EyeSlashIcon className="w-5 h-5" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.newPasswordConfirm && (
                                        <p className="text-red-500 text-sm">{errors.newPasswordConfirm}</p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 mt-4">
                                    <Link
                                        href="/members/detail"
                                        className="flex-1 flex justify-center items-center py-3 rounded-md border-2 border-neutral-normal hover:bg-neutral-normal hover:text-white transition font-bold text-lg"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 flex justify-center items-center py-3 rounded-md font-bold text-lg text-white transition ${
                                            loading
                                                ? "bg-neutral-normal cursor-not-allowed"
                                                : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"
                                        }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                                Memproses...
                                            </span>
                                        ) : (
                                            "Ganti Password"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </RevealSection>
                </div>
            </div>
        </Container>
    );
}