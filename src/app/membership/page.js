"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import BatikOverlay from "@/src/components/BatikOverlay";
import { membershipService } from "@/src/services/membershipService";
import { useAuth } from "@/src/contexts/AuthContext";
import Swal from "sweetalert2";
import { formatRupiah, dateConverted } from "@/src/lib/utils";
import ImageUpload from "@/src/components/ImageUpload";
import SelectInput from "@/src/components/SelectInput";
import Link from "next/link";

export default function MembershipPage() {
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [history, setHistory] = useState([]);
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("transfer");
    const [paymentProof, setPaymentProof] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // 🔥 Ambil data membership
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/members/detail");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [statusRes, historyRes, plansRes] = await Promise.all([
                    membershipService.getStatus(),
                    membershipService.getHistory(),
                    membershipService.getPlans(),
                ]);

                const plansData = plansRes.data?.data || [];
                setPlans(plansData);
                setStatus(statusRes.data?.data || null);
                setHistory(historyRes.data?.data || []);
            } catch (err) {
                console.error("Error fetching membership data:", err);
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memuat Data",
                    text: err.response?.data?.message || "Terjadi kesalahan",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn, router]);

    // 🔥 Handle subscribe
    const handleSubscribe = async (e) => {
        e.preventDefault();

        // 🔥 Validasi
        if (!selectedPlan) {
            Swal.fire({ icon: "warning", title: "Pilih paket membership!" });
            return;
        }

        if (!paymentMethod) {
            Swal.fire({ icon: "warning", title: "Pilih metode pembayaran!" });
            return;
        }

        // 🔥 Cari plan yang dipilih
        const selectedPlanData = plans.find(p => {
            return p.key === selectedPlan || 
                   p.id === selectedPlan || 
                   p.type === selectedPlan ||
                   String(p.id) === String(selectedPlan);
        });

        if (!selectedPlanData) {
            Swal.fire({ 
                icon: "error", 
                title: "Paket tidak ditemukan!",
                text: "Silakan pilih ulang paket membership."
            });
            return;
        }

        // 🔥 Cek apakah paket berbayar
        const isPaidPlan = selectedPlanData.price > 0;

        if (isPaidPlan && !paymentProof) {
            Swal.fire({ 
                icon: "warning", 
                title: "Upload bukti pembayaran!",
                text: "Silakan upload bukti transfer untuk paket berbayar."
            });
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            
            // 🔥 Kirim key dari plan
            const membershipType = selectedPlanData.key || selectedPlanData.type || String(selectedPlanData.id);
            formData.append("membership_type", membershipType);
            formData.append("payment_method", paymentMethod);
            
            // 🔥 APPEND FILE DENGAN CARA YANG BENAR
            if (paymentProof) {
                // 🔥 Pastikan file adalah File object
                if (paymentProof instanceof File) {
                    formData.append("payment_proof", paymentProof);
                    console.log("📎 File appended:", paymentProof.name, paymentProof.size, paymentProof.type);
                } else if (typeof paymentProof === 'string') {
                    // 🔥 Jika string (misal base64), konversi ke blob
                    const response = await fetch(paymentProof);
                    const blob = await response.blob();
                    const file = new File([blob], "payment-proof.jpg", { type: "image/jpeg" });
                    formData.append("payment_proof", file);
                }
            }

            // 🔥 DEBUG: Log semua data FormData
            console.log("📦 FormData entries:");
            for (let pair of formData.entries()) {
                const value = pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1];
                console.log(pair[0], value);
            }

            const response = await membershipService.subscribe(formData);
            
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: response.data?.message || "Permintaan membership berhasil dikirim. Tunggu konfirmasi admin.",
                confirmButtonText: "OK",
            }).then(() => {
                window.location.reload();
            });
        } catch (err) {
            console.error("❌ Subscribe error:", err);
            console.error("❌ Response:", err.response?.data);
            
            const errorData = err.response?.data;
            let errorMessage = "Terjadi kesalahan";
            
            if (errorData?.message) {
                errorMessage = errorData.message;
            }
            
            if (errorData?.errors) {
                const errors = errorData.errors;
                const errorDetails = Object.keys(errors).map(key => {
                    return `${key}: ${errors[key].join(", ")}`;
                }).join("\n");
                errorMessage = errorDetails || errorMessage;
            }
            
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: errorMessage,
            });
        } finally {
            setSubmitting(false);
        }
    };

    // 🔥 Handle cancel membership
    const handleCancel = async () => {
        const confirm = await Swal.fire({
            title: "Batalkan Membership?",
            text: "Kamu yakin ingin membatalkan membership?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Batalkan!",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        try {
            await membershipService.cancel();
            Swal.fire({
                icon: "success",
                title: "Membership Dibatalkan!",
                text: "Membership kamu sudah dibatalkan.",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                window.location.reload();
            });
        } catch (err) {
            console.error("Cancel error:", err.response?.data);
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    // 🔥 Handle file change
    const handleFileChange = (file) => {
        console.log("📎 File received:", file);
        if (file && file instanceof File) {
            console.log("📎 File valid:", file.name, file.size, file.type);
            setPaymentProof(file);
        } else {
            console.warn("⚠️ Invalid file:", file);
            setPaymentProof(null);
        }
    };

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-lg">Memuat data membership...</p>
                    </div>
                </div>
            </Container>
        );
    }

    const isMemberActive = status?.is_membership_active || false;
    const membershipType = status?.membership_type || "none";

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                <BatikOverlay />
                <div className="px-4 md:px-0 max-w-306 mx-auto py-8">
                    
                    <RevealSection direction="up">
                        <div className="flex items-center gap-4 mt-16">
                            <Link href="/members/detail" className="text-neutral-dark hover:text-primary-text transition-colors">
                                ← Kembali ke Profil
                            </Link>
                        </div>
                    </RevealSection>

                    {/* Header */}
                    <RevealSection direction="up">
                        <div className="flex flex-col items-center justify-center mt-4 mb-8">
                            <h1 className="text-4xl font-bold font-young text-primary-darker">
                                Membership
                            </h1>
                            <p className="text-neutral-dark mt-2 text-center">
                                Kelola membership kamu di SH3 Running Club
                            </p>
                        </div>
                    </RevealSection>

                    {/* Status Membership */}
                    <RevealSection direction="up">
                        <div className="max-w-3xl mx-auto bg-primary-light border-2 border-neutral-normal rounded-lg p-6 md:p-8 shadow-lg mb-6">
                            <h2 className="text-2xl font-bold font-young mb-4">Status Membership</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold">Status: </span>
                                    <span className={`font-bold ${isMemberActive ? "text-green-600" : "text-red-500"}`}>
                                        {isMemberActive ? "✅ Aktif" : "❌ Tidak Aktif"}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold">Tipe: </span>
                                    <span>{membershipType !== "none" ? membershipType : "-"}</span>
                                </div>
                                {isMemberActive && (
                                    <>
                                        <div>
                                            <span className="font-semibold">Mulai: </span>
                                            <span>{status?.membership_start_date ? dateConverted(status.membership_start_date) : "-"}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Berakhir: </span>
                                            <span className="text-red-500 font-bold">
                                                {status?.membership_end_date ? dateConverted(status.membership_end_date) : "-"}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {isMemberActive && (
                                <button
                                    onClick={handleCancel}
                                    className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition-colors"
                                >
                                    Batalkan Membership
                                </button>
                            )}
                        </div>
                    </RevealSection>

                    {/* Daftar Plan */}
                    <RevealSection direction="up">
                        <div className="max-w-3xl mx-auto bg-primary-light border-2 border-neutral-normal rounded-lg p-6 md:p-8 shadow-lg mb-6">
                            <h2 className="text-2xl font-bold font-young mb-4">Paket Membership</h2>
                            
                            {plans.length === 0 ? (
                                <p className="text-neutral-dark">Belum ada paket membership tersedia.</p>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {plans.map((plan, index) => {
                                            const planKey = plan.key || plan.type || String(plan.id);
                                            const isSelected = selectedPlan === planKey || selectedPlan === plan.id;
                                            
                                            return (
                                                <label
                                                    key={plan.id || index}
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                        isSelected
                                                            ? "border-secondary-bg bg-secondary-bg/10 ring-2 ring-secondary-bg"
                                                            : "border-neutral-normal hover:border-secondary-bg/50 hover:bg-primary-light/50"
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedPlan(planKey);
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <input
                                                            type="radio"
                                                            name="membership_plan"
                                                            value={planKey}
                                                            checked={isSelected}
                                                            onChange={() => {}}
                                                            className="mt-1 w-4 h-4 accent-secondary-bg cursor-pointer"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg">{plan.name}</h3>
                                                            <p className="text-sm text-neutral-dark">{plan.description || "-"}</p>
                                                            <p className="text-xl font-bold text-secondary-bg mt-2">
                                                                Rp {formatRupiah(plan.price || 0)}
                                                            </p>
                                                            <p className="text-xs text-neutral-dark">
                                                                Durasi: {plan.duration} {plan.duration_unit}
                                                            </p>
                                                            {plan.discount_percentage > 0 && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                                    Diskon {plan.discount_percentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {selectedPlan && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                                            ✅ Paket terpilih: <span className="font-bold">
                                                {plans.find(p => (p.key || p.type || String(p.id)) === selectedPlan)?.name || selectedPlan}
                                            </span>
                                        </div>
                                    )}

                                    {/* Metode Pembayaran */}
                                    <SelectInput
                                        id="payment_method"
                                        name="payment_method"
                                        label="Metode Pembayaran"
                                        options={[
                                            { value: "transfer", label: "Transfer Bank" },
                                            { value: "qris", label: "QRIS" },
                                            { value: "cash", label: "Tunai" },
                                        ]}
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                    />

                                    {/* 🔥 Upload Bukti */}
                                    <ImageUpload
                                        id="payment_proof"
                                        label="Upload Bukti Pembayaran"
                                        onChange={handleFileChange}
                                    />

                                    <button
                                        type="submit"
                                        disabled={submitting || !selectedPlan}
                                        className={`py-3 rounded-md font-bold text-white transition ${
                                            submitting || !selectedPlan
                                                ? "bg-neutral-normal cursor-not-allowed"
                                                : "bg-secondary-bg hover:bg-secondary-bg-hover"
                                        }`}
                                    >
                                        {submitting ? "Memproses..." : "Subscribe Membership"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </RevealSection>

                    {/* Riwayat Membership */}
                    <RevealSection direction="up">
                        <div className="max-w-3xl mx-auto bg-primary-light border-2 border-neutral-normal rounded-lg p-6 md:p-8 shadow-lg">
                            <h2 className="text-2xl font-bold font-young mb-4">Riwayat Membership</h2>
                            
                            {history.length === 0 ? (
                                <p className="text-neutral-dark">Belum ada riwayat membership.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-primary-light-active">
                                                <th className="px-4 py-2 text-left text-sm font-bold">Tipe</th>
                                                <th className="px-4 py-2 text-left text-sm font-bold">Status</th>
                                                <th className="px-4 py-2 text-left text-sm font-bold">Mulai</th>
                                                <th className="px-4 py-2 text-left text-sm font-bold">Berakhir</th>
                                                <th className="px-4 py-2 text-left text-sm font-bold">Harga</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((item) => (
                                                <tr key={item.id} className="border-b border-neutral-light">
                                                    <td className="px-4 py-2 text-sm">{item.membership_type}</td>
                                                    <td className="px-4 py-2 text-sm">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                            item.status === "active" ? "bg-green-100 text-green-700" :
                                                            item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                            item.status === "expired" ? "bg-gray-100 text-gray-700" :
                                                            item.status === "cancelled" ? "bg-red-100 text-red-700" :
                                                            "bg-gray-100 text-gray-700"
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">{dateConverted(item.start_date)}</td>
                                                    <td className="px-4 py-2 text-sm">{dateConverted(item.end_date)}</td>
                                                    <td className="px-4 py-2 text-sm font-bold">Rp {formatRupiah(item.price || 0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </RevealSection>

                </div>
            </div>
        </Container>
    );
}