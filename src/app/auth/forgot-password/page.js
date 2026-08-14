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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
                    
                    {/* 🔥 Back Button (sama seperti login) */}
                    <RevealSection direction="up">
                        <Link href="/members/detail" className="static md:absolute mt-8">
                            <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                        </Link>
                    </RevealSection>

                    {/* 🔥 Header (sama seperti login) */}
                    <RevealSection direction="up">
                        <div className="flex flex-col items-center justify-center mt-24 mb-8">
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

                    {/* 🔥 Form (sama stylingnya dengan login) */}
                    <RevealSection direction="up">
                        <div className="flex flex-col justify-center items-center gap-4 w-full max-w-md mx-auto">
                            
                            {/* STEP 1: VERIFY */}
                            {step === 1 && (
                                <form onSubmit={handleVerify} className="w-full space-y-4">
                                    <InputType
                                        label="Username"
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        placeholder="john_doe"
                                        className="flex flex-col gap-2 w-full"
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
                                        className="flex flex-col gap-2 w-full"
                                        value={hashId}
                                        onChange={(e) => {
                                            setHashId(e.target.value.toUpperCase());
                                            setErrors({});
                                        }}
                                        error={errors.hash_id}
                                    />

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                        <p className="font-medium">📌 Informasi</p>
                                        <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                                            <li>Masukkan Username dan Hash ID yang terdaftar</li>
                                            <li>Hash ID bisa dilihat di halaman profile</li>
                                            <li>Contoh Hash ID: <span className="font-mono font-bold">0000</span></li>
                                        </ul>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex justify-center items-center p-8 rounded-md w-full ${
                                            loading ? "bg-neutral-bg-active" : "bg-secondary-bg hover:bg-secondary-bg-hover"
                                        } active:bg-secondary-bg-active h-16 font-bold text-xl text-white md:text-3xl transition-colors`}
                                    >
                                        {loading ? "Memverifikasi..." : "Verifikasi"}
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: RESET PASSWORD */}
                            {step === 2 && (
                                <form onSubmit={handleResetPassword} className="w-full space-y-4">
                                    {/* Info Username + Hash ID */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <p className="text-sm text-neutral-dark">
                                            <span className="font-semibold">Username:</span> {username}
                                        </p>
                                        <p className="text-sm text-neutral-dark">
                                            <span className="font-semibold">Hash ID:</span> {hashId}
                                        </p>
                                    </div>

                                    {/* Password Baru */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="font-medium text-xl">
                                            Password Baru <span className="text-red-500 ml-0.5">*</span>
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
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                                            >
                                                {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                                    </div>

                                    {/* Konfirmasi Password Baru */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="font-medium text-xl">
                                            Konfirmasi Password Baru <span className="text-red-500 ml-0.5">*</span>
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
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                                            >
                                                {showNewPasswordConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.newPasswordConfirm && <p className="text-red-500 text-sm">{errors.newPasswordConfirm}</p>}
                                    </div>

                                    <div className="flex gap-4 w-full">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep(1);
                                                setNewPassword("");
                                                setNewPasswordConfirm("");
                                            }}
                                            className="flex-1 flex justify-center items-center p-8 rounded-md border-2 border-neutral-normal hover:bg-neutral-normal hover:text-white h-16 font-bold text-xl md:text-2xl transition-colors"
                                        >
                                            Kembali
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 flex justify-center items-center p-8 rounded-md ${
                                                loading ? "bg-neutral-bg-active" : "bg-secondary-bg hover:bg-secondary-bg-hover"
                                            } active:bg-secondary-bg-active h-16 font-bold text-xl text-white md:text-3xl transition-colors`}
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