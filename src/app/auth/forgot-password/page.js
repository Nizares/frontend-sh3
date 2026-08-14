"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import InputType from "@/src/components/Inputs";
import BatikOverlay from "@/src/components/BatikOverlay";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { participantAuthService } from "@/src/services/participantAuthService";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Verify, 2: Reset Password
    const [username, setUsername] = useState("");
    const [hashId, setHashId] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
    const [errors, setErrors] = useState({});

    // 🔥 STEP 1: VERIFY
    const handleVerify = async (e) => {
        e.preventDefault();
        
        if (!username || !hashId) {
            Swal.fire({
                icon: "warning",
                title: "Data belum lengkap!",
                text: "Masukkan Username dan Hash ID.",
            });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await participantAuthService.verifyReset({
                username: username,
                hash_id: hashId,
            });

            const data = response.data;

            if (data.success) {
                setStep(2);
                Swal.fire({
                    icon: "success",
                    title: "Verifikasi Berhasil!",
                    text: "Silakan masukkan password baru.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Verifikasi Gagal!",
                    text: data.message || "Data participant tidak valid.",
                });
            }
        } catch (err) {
            console.error("Verify error:", err.response?.data);
            
            // Error dari backend (422, dll)
            const errorData = err.response?.data;
            if (errorData?.errors) {
                const formattedErrors = {};
                Object.keys(errorData.errors).forEach((key) => {
                    formattedErrors[key] = errorData.errors[key][0];
                });
                setErrors(formattedErrors);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: errorData?.message || "Terjadi kesalahan, coba lagi.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔥 STEP 2: RESET PASSWORD
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validasi
        if (!newPassword) {
            setErrors({ newPassword: "Password baru wajib diisi." });
            return;
        }
        if (newPassword.length < 8) {
            setErrors({ newPassword: "Password minimal 8 karakter." });
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            setErrors({ newPasswordConfirm: "Konfirmasi password tidak cocok." });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await participantAuthService.resetPassword({
                username: username,
                hash_id: hashId,
                password: newPassword,
                password_confirmation: newPasswordConfirm,
            });

            const data = response.data;

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Password Berhasil Direset!",
                    text: "Silakan login dengan password baru kamu.",
                    confirmButtonText: "OK",
                }).then(() => {
                    router.push("/members/detail");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: data.message || "Terjadi kesalahan, coba lagi.",
                });
            }
        } catch (err) {
            console.error("Reset password error:", err.response?.data);

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
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Terjadi kesalahan, coba lagi nanti.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover min-h-screen">
                <BatikOverlay />
                <div className="px-4 md:px-0 max-w-306 mx-auto py-8">
                    
                    {/* Back Button */}

                    {/* Header */}
                    <RevealSection direction="up">
                        <div className="flex flex-col items-center justify-center mt-16 mb-8">
                            <h1 className="text-4xl font-bold font-young text-primary-darker">
                                {step === 1 ? "Lupa Password?" : "Reset Password"}
                            </h1>
                            <p className="text-neutral-dark mt-2 text-center">
                                {step === 1 
                                    ? "Masukkan Username dan Hash ID untuk verifikasi."
                                    : "Masukkan password baru kamu."
                                }
                            </p>
                        </div>
                    </RevealSection>

                    {/* Form */}
                    <RevealSection direction="up">
                        <div className="max-w-md mx-auto bg-primary-light border-2 border-neutral-normal rounded-lg p-6 md:p-8 shadow-lg">
                            
                            {/* STEP 1: VERIFY */}
                            {step === 1 && (
                                <form onSubmit={handleVerify} className="flex flex-col gap-6">
                                    <InputType
                                        label="Username"
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        placeholder="Masukkan username kamu"
                                        className="flex flex-col gap-2"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setErrors({});
                                        }}
                                        error={errors.username}
                                    />

                                    <InputType
                                        label="Hash ID"
                                        id="hash_id"
                                        type="text"
                                        name="hash_id"
                                        required
                                        placeholder="Contoh: 0000"
                                        className="flex flex-col gap-2"
                                        value={hashId}
                                        onChange={(e) => {
                                            setHashId(e.target.value.toUpperCase());
                                            setErrors({});
                                        }}
                                        error={errors.hash_id}
                                    />

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                        <p className="font-medium">Informasi</p>
                                        <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                                            <li>Masukkan Username dan Hash ID yang terdaftar</li>
                                            <li>Hash ID bisa dilihat di halaman profile</li>
                                            <li>Contoh Hash ID: <span className="font-mono font-bold">0000</span></li>
                                        </ul>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex justify-center items-center py-3 rounded-md font-bold text-lg text-white transition ${
                                            loading
                                                ? "bg-neutral-normal cursor-not-allowed"
                                                : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"
                                        }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                                Memverifikasi...
                                            </span>
                                        ) : (
                                            "Verifikasi"
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: RESET PASSWORD */}
                            {step === 2 && (
                                <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                                    {/* Username (readonly) */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <p className="text-sm text-neutral-dark">
                                            <span className="font-semibold">Username:</span> {username}
                                        </p>
                                        <p className="text-sm text-neutral-dark">
                                            <span className="font-semibold">Hash ID:</span> {hashId}
                                        </p>
                                    </div>

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
                                                placeholder="Minimal 8 karakter"
                                                className={`outline-2 p-3 bg-white outline-tertiary-normal rounded-md w-full pr-12 ${
                                                    errors.newPassword ? "border-red-500 outline-red-500" : ""
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
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
                                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                                placeholder="Ulangi password baru"
                                                className={`outline-2 p-3 bg-white outline-tertiary-normal rounded-md w-full pr-12 ${
                                                    errors.newPasswordConfirm ? "border-red-500 outline-red-500" : ""
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                                            >
                                                {showNewPasswordConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.newPasswordConfirm && <p className="text-red-500 text-sm">{errors.newPasswordConfirm}</p>}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep(1);
                                                setNewPassword("");
                                                setNewPasswordConfirm("");
                                            }}
                                            className="flex-1 py-3 rounded-md border-2 border-neutral-normal hover:bg-neutral-normal hover:text-white transition font-bold text-lg"
                                        >
                                            Kembali
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 py-3 rounded-md font-bold text-lg text-white transition ${
                                                loading
                                                    ? "bg-neutral-normal cursor-not-allowed"
                                                    : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"
                                            }`}
                                        >
                                            {loading ? "Memproses..." : "Reset Password"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </RevealSection>
                </div>
            </div>
        </Container>
    );
}