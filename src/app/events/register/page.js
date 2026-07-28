"use client";

import Image from "next/image";
import Link from "next/link";
import Form from "next/form";

import Container from "@/src/components/Container";
import SelectInput from "@/src/components/SelectInput";
import InputType from "@/src/components/Inputs";
import ImageUpload from "@/src/components/ImageUpload";
import InvoiceEvent from "@/src/components/InvoiceEvent";
import BatikOverlay from "@/src/components/BatikOverlay";
import { RevealSection } from "@/src/components/RevealSection";

import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

import { useAuth } from "@/src/contexts/AuthContext";
import { eventService } from "@/src/services/eventService";
import { orderService } from "@/src/services/orderService";

import { concateDate, formatRupiah } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const paymentOptions = [
    {
        value: "Transfer Bank Mandiri",
        label: "Bank Transfer Mandiri",
        NoRek: "1480087846666",
        nama: "An. Perkumpulan Samarinda Hidup Hutan Hijau",
        image: "/assets/icon/mandiri.png",
    }
];

export default function RegisterEvent() {
    const { user, isLoggedIn, loading: authLoading } = useAuth();
    const [event, setEvent] = useState(null);
    const [payOptions, setPayOptions] = useState("");
    const [paymentFile, setPaymentFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [orderResult, setOrderResult] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [attendanceCode, setAttendanceCode] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null); // ← tracking status

    const selectedBank = paymentOptions.find((p) => p.value === payOptions);
    const router = useRouter();

    // Ambil data event
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("id") || 1;
        eventService
            .getById(eventId)
            .then((res) => {
                setEvent(res.data.data);
                // Cek apakah user sudah daftar event ini
                const token = localStorage.getItem("token");
                if (token) {
                    eventService.getMyEvents()
                        .then((res) => {
                            const joined = res.data.data.find(e => e.id === Number(eventId));
                            if (joined?.order) {
                                setOrderStatus(joined.order.status);
                                // Jika sudah paid/free, tampilkan QR
                                if (joined.order.status === "paid" || joined.order.status === "free") {
                                    const attendance = joined.order.attendance;
                                    if (attendance?.qr_code_image) {
                                        setQrCode(attendance.qr_code_image);
                                        setAttendanceCode(attendance.qr_code || joined.order.ticket_code);
                                        setShowQR(true);
                                    }
                                }
                            }
                        })
                        .catch(() => { });
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // Polling untuk cek status order (jika pending)
    useEffect(() => {
        if (orderStatus === "pending" && event) {
            const interval = setInterval(async () => {
                try {
                    const res = await eventService.getMyEvents();
                    const joined = res.data.data.find(e => e.id === event.id);
                    if (joined?.order) {
                        const newStatus = joined.order.status;
                        if (newStatus !== orderStatus) {
                            setOrderStatus(newStatus);
                            // Jika sudah paid, tampilkan QR
                            if (newStatus === "paid" || newStatus === "free") {
                                const attendance = joined.order.attendance;
                                if (attendance?.qr_code_image) {
                                    setQrCode(attendance.qr_code_image);
                                    setAttendanceCode(attendance.qr_code || joined.order.ticket_code);
                                    setShowQR(true);
                                    Swal.fire({
                                        icon: "success",
                                        title: "Pembayaran Dikonfirmasi!",
                                        text: "QR Code tiket kamu sudah aktif.",
                                    });
                                }
                                clearInterval(interval);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            }, 5000); // Cek setiap 5 detik

            return () => clearInterval(interval);
        }
    }, [orderStatus, event]);

    async function submitPembayaran(e) {
        e.preventDefault();

        if (!isLoggedIn || !user) {
            Swal.fire({
                icon: "warning",
                title: "Belum Login!",
                text: "Silakan login dulu sebelum mendaftar event.",
                confirmButtonText: "Login Sekarang",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/members/detail");
                }
            });
            return;
        }

        const participantId = user?.hash_id;
        if (!participantId) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Data participant tidak ditemukan. Silakan login ulang.",
            });
            return;
        }

        setSubmitLoading(true);
        try {
            const orderRes = await orderService.create(event.id, participantId);
            const { order, attendance } = orderRes.data.data;
            const orderId = order.id;
            const invoice_number = order.invoice_number;
            const ticket_code = order.ticket_code;

            // 🔥 EVENT GRATIS - QR LANGSUNG MUNCUL
            if (order.status === "free") {
                const qr = attendance?.qr_code_image;
                const code = attendance?.qr_code || ticket_code;
                setQrCode(qr);
                setAttendanceCode(code);
                setShowQR(true);
                setOrderStatus("free");
                setOrderResult({ order_id: orderId, invoice_number, ticket_code });

                Swal.fire({
                    icon: "success",
                    title: "Pendaftaran Berhasil!",
                    text: "Event ini gratis! Tiket dan QR Code kamu sudah aktif.",
                });
                return;
            }

            // 🔥 EVENT BERBAYAR - butuh upload payment
            if (!paymentFile) {
                Swal.fire({ icon: "warning", title: "Upload bukti bayar dulu!" });
                return;
            }

            const formData = new FormData();
            formData.append("payment_proof", paymentFile);
            formData.append("payment_method", payOptions || "transfer");
            formData.append("amount", event.price);
            formData.append("paid_at", new Date().toISOString().slice(0, 19).replace("T", " "));

            await orderService.uploadPayment(orderId, formData);
            setOrderStatus("pending");
            setOrderResult({ order_id: orderId, invoice_number, ticket_code });

            Swal.fire({
                icon: "info",
                title: "Pembayaran Terkirim!",
                text: "Tunggu konfirmasi admin untuk mengaktifkan QR Code tiket kamu.",
                confirmButtonText: "OK",
            });

        } catch (err) {
            console.error("🔴 Order error:", err.response?.data);
            setOrderResult(null);
            setShowQR(false);

            // 🔥 SUDAH TERDAFTAR
            if (err.response?.data?.message === "You have already registered for this event") {
                const existingData = err.response?.data?.data;
                if (existingData?.attendance?.qr_code_image) {
                    setQrCode(existingData.attendance.qr_code_image);
                    setAttendanceCode(existingData.attendance.qr_code || existingData.ticket_code);
                    setShowQR(true);
                    Swal.fire({
                        icon: "info",
                        title: "Sudah Terdaftar!",
                        text: "Kamu sudah pernah mendaftar event ini. QR Code kamu tetap aktif.",
                        confirmButtonText: "Lihat QR Code",
                    });
                    return;
                }

                Swal.fire({
                    icon: "info",
                    title: "Sudah Terdaftar!",
                    text: "Kamu sudah pernah mendaftar event ini. Cek di My Events.",
                    confirmButtonText: "Lihat My Events",
                }).then(() => {
                    router.push("/members/my-events");
                });
                return;
            }

            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
            });
        } finally {
            setSubmitLoading(false);
        }
    }

    function higherPrice(event_price) {
        if (event_price > 0) {
            return event_price * 2;
        } else {
            return 1000000;
        }
    }

    function handleDownloadQR() {
        if (!qrCode) return;

        const img = new window.Image();
        const svgString = atob(qrCode);
        const svgBlob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 500;
            canvas.height = 500;

            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const pngUrl = canvas.toDataURL("image/png");

                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = `tiket-${attendanceCode}.png`;
                link.click();
            }

            URL.revokeObjectURL(url);
        };

        img.onerror = (err) => {
            console.error("Gagal memuat gambar SVG:", err);
        };
    }

    if (!event)
        return <div className="flex justify-center p-16 text-2xl">Loading...</div>;

    const isFreeEvent = event.price === 0 || event.price === "0" || event.price === null;
    const isPaid = orderStatus === "paid" || orderStatus === "free";
    const isPending = orderStatus === "pending";

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
                <BatikOverlay />
                <div className="px-4 md:px-0 max-w-306 mx-auto relative">
                    <RevealSection direction="up">
                        <div className="flex flex-col gap-y-4 mt-8">
                            <Link href="/events" className="static md:absolute">
                                <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                            </Link>
                            <div className="flex items-center justify-center w-full">
                                <h1 className="text-4xl font-bold mt-16 text-center md:text-7xl">{event.title}</h1>
                            </div>

                            <div className="flex flex-row justify-between gap-x-2 mt-8">
                                <div className="flex flex-row justify-center gap-x-2 w-1/2">
                                    <MapPinIcon className="w-8 h-8" />
                                    <div className="text-lg font-bold">{event.location}</div>
                                </div>
                                <div className="text-lg font-bold">
                                    {concateDate(event.start_date, event.end_date)}
                                </div>
                            </div>
                        </div>
                    </RevealSection>

                    <RevealSection direction="up">
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            width={600}
                            height={450}
                            className="h-128 w-full flex object-cover rounded-lg"
                        />
                    </RevealSection>

                    <RevealSection direction="up">
                        <div className="text-3xl font-bold p-8 font-young">Register Detail</div>

                        <div className="flex justify-center gap-8 flex-col md:flex-row mb-8">
                            <div className="bg-primary-light border-2 border-neutral-normal p-4 w-full rounded-md">
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-bold">Early Bid</h3>
                                    <div className="text-sm line-through">
                                        Rp. {formatRupiah(higherPrice(event.price))}
                                    </div>
                                    <div className="text-lg font-bold">
                                        Rp. {formatRupiah(event.price)}/person
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <ol className="list-decimal list-inside p-2">
                                        {event.key_points?.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ol>
                                    <div className="text-xl font-bold">Event Organizer</div>
                                    <div className="text-lg font-semibold">{event.creator?.name}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-primary-light border-neutral-normal border-2 p-4 w-full rounded-md">
                                <div className="font-bold text-3xl">Slot Tersisa:</div>
                                <div className="font-bold text-5xl font-young">
                                    {event.remaining_quota}
                                </div>
                            </div>
                        </div>
                    </RevealSection>

                    <Form onSubmit={submitPembayaran} className="flex flex-col gap-8">
                        <RevealSection direction="up">
                            <div className="flex flex-col bg-primary-light p-4 gap-4 border-neutral-normal border-2 rounded-md">
                                <div className="flex justify-between">
                                    <div className="text-2xl font-bold font-young">
                                        Customer Information
                                    </div>
                                    <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                                </div>
                                <hr className="border-t-2 border-text-colors" />

                                {authLoading ? (
                                    <div className="text-center py-8 text-xl">Loading...</div>
                                ) : isLoggedIn && user ? (
                                    <RevealSection direction="up">
                                        <div className="flex flex-col gap-2">
                                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                                                <p className="text-green-700 font-medium">
                                                    Login sebagai: <span className="font-bold">{user.name}</span>
                                                </p>
                                            </div>
                                            <InputType
                                                label="Full Name"
                                                id="name"
                                                required
                                                type="text"
                                                name="fullname"
                                                placeholder="John Doe"
                                                className="flex flex-col gap-2"
                                                value={user.name || ""}
                                                readOnly
                                            />
                                            <InputType
                                                label="Email"
                                                id="email"
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="you@example.com"
                                                className="flex flex-col gap-2"
                                                value={user.email || ""}
                                                readOnly
                                            />
                                            <InputType
                                                label="Nomor Telepon/WA"
                                                type="text"
                                                id="telpnumber"
                                                required
                                                name="telpnumber"
                                                placeholder="08123456789"
                                                className="flex flex-col gap-2"
                                                value={user.phone || "-"}
                                                readOnly
                                            />
                                        </div>
                                    </RevealSection>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                                        <p className="text-xl text-neutral-dark">
                                            Silakan login terlebih dahulu untuk mendaftar event.
                                        </p>
                                        <Link
                                            href="/members/detail"
                                            className="bg-secondary-bg hover:bg-secondary-bg-hover text-white font-bold py-3 px-8 rounded-md transition-colors"
                                        >
                                            Login Sekarang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </RevealSection>

                        <RevealSection direction="up">
                            <div className="flex flex-col bg-primary-light border-neutral-normal border-2 p-4 gap-4 rounded-md">
                                <div className="flex justify-between">
                                    <div className="text-2xl font-bold font-young">
                                        Payment Details
                                    </div>
                                    <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                                </div>
                                <hr className="border-t-2 border-text-colors" />
                                <div className="flex justify-between">
                                    <div className="text-xl font-medium">Event Name</div>
                                    <div className="text-xl font-medium">{event.title}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-xl font-medium">Event Price</div>
                                    <div className="text-xl font-medium">
                                        {isFreeEvent ? "GRATIS" : `Rp. ${formatRupiah(event.price)}`}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-xl font-bold">Total</div>
                                    <div className="text-2xl font-bold">
                                        {isFreeEvent ? "GRATIS" : `Rp. ${formatRupiah(event.price)}`}
                                    </div>
                                </div>
                            </div>
                        </RevealSection>

                        {/* 🔥 TAMPILAN STATUS ORDER */}
                        {isPaid && showQR && qrCode && (
                            <RevealSection direction="up">
                                <div className="flex flex-col items-center gap-4 bg-green-50 border-2 border-green-300 rounded-lg p-6">
                                    <div className="text-2xl font-bold text-green-700">✅ Tiket Aktif</div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <img
                                            src={`data:image/svg+xml;base64,${qrCode}`}
                                            alt="QR Code Tiket"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Tunjukkan QR ini saat check-in di Acara
                                    </div>
                                    <div className="text-xl font-young px-4 py-2 bg-gray-100 rounded-md font-mono">
                                        {attendanceCode}
                                    </div>
                                    <button
                                        onClick={handleDownloadQR}
                                        className="cursor-pointer flex justify-center items-center gap-2 bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active text-white font-bold px-8 py-3 font-young rounded-md"
                                    >
                                        Download QR
                                    </button>
                                </div>
                            </RevealSection>
                        )}

                        {isPending && (
                            <RevealSection direction="up">
                                <div className="flex flex-col items-center gap-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                                    <div className="text-2xl font-bold text-yellow-600">⏳ Menunggu Konfirmasi</div>
                                    <p className="text-gray-600 text-center">
                                        Pembayaranmu sedang diverifikasi oleh admin.
                                        <br />
                                        QR Code akan muncul setelah pembayaran dikonfirmasi.
                                    </p>
                                    <div className="text-sm text-gray-500 mt-2">
                                        Invoice: <span className="font-mono">{orderResult?.invoice_number}</span>
                                    </div>
                                </div>
                            </RevealSection>
                        )}

                        {/* 🔥 PAYMENT PROCESS - HANYA UNTUK EVENT BERBAYAR & BELUM DAFTAR */}
                        {!isFreeEvent && !isPaid && !isPending && (
                            <div className="flex flex-col bg-primary-light border-neutral-normal border-2 p-4 gap-4 rounded-md z-1 mb-4">
                                <RevealSection direction="up">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between">
                                            <div className="text-2xl font-bold font-young">
                                                Payment Process
                                            </div>
                                            <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                                        </div>
                                        <hr className="border-t-2 border-text-colors" />
                                        <SelectInput
                                            id="payoptions"
                                            name="payOptions"
                                            label="Payment Options"
                                            options={paymentOptions}
                                            value={payOptions}
                                            placehold="Pilih Pembayaran..."
                                            onChange={(e) => setPayOptions(e.target.value)}
                                        />
                                        <div className="flex flex-col items-center justify-center p-8">
                                            {selectedBank && (
                                                <div className="flex flex-row gap-8">
                                                    <Image
                                                        src={selectedBank.image}
                                                        alt={selectedBank.nama}
                                                        width={150}
                                                        height={100}
                                                        className="flex object-contain"
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="font-semibold text-lg">
                                                            {selectedBank.nama}
                                                        </div>
                                                        <div className="font-semibold text-lg">
                                                            {selectedBank.NoRek}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="text-2xl font-bold m-8">atau</div>
                                            <Image
                                                src="/assets/images/qris.jpeg"
                                                alt="QRIS"
                                                width={450}
                                                height={600}
                                                className="w-full max-w-sm flex object-cover items-center justify-center"
                                            />
                                        </div>
                                    </div>
                                </RevealSection>

                                <RevealSection direction="up">
                                    <div className="flex flex-col gap-4">
                                        <div className="text-2xl font-bold font-young">
                                            Upload Proof of Payment
                                        </div>
                                        <ImageUpload
                                            id="paymentproof"
                                            label="Payment Proof"
                                            required
                                            onChange={(file) => setPaymentFile(file)}
                                        />
                                    </div>
                                </RevealSection>
                            </div>
                        )}

                        {/* 🔥 TOMBOL SUBMIT */}
                        <RevealSection direction="up">
                            <div className="flex flex-col gap-4">
                                {/* Jika sudah paid/free, tombol disembunyikan */}
                                {!isPaid && !showQR && (
                                    <button
                                        className={`flex justify-center font-young rounded-md items-center ${submitLoading ? "bg-neutral-normal-active" : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"}  h-16 font-bold text-xl text-white m-10 md:text-3xl`}
                                        type="submit"
                                        disabled={submitLoading || !isLoggedIn || isPending}
                                    >
                                        {submitLoading ? "Memproses..." : isFreeEvent ? "Daftar Gratis" : "Confirm Payment"}
                                    </button>
                                )}
                                {!isLoggedIn && (
                                    <p className="text-center text-red-500 font-medium">
                                        *Login terlebih dahulu untuk melanjutkan
                                    </p>
                                )}
                                {isPending && (
                                    <p className="text-center text-yellow-600 font-medium">
                                        *Pembayaran sedang diverifikasi, mohon tunggu.
                                    </p>
                                )}
                                {isPaid && showQR && (
                                    <Link href="/events" className="text-center text-secondary-bg font-medium hover:underline">
                                        ← Kembali ke Events
                                    </Link>
                                )}
                            </div>
                        </RevealSection>
                    </Form>

                    {orderResult && !showQR && (
                        <RevealSection direction="up">
                            <InvoiceEvent
                                name={user?.name || ""}
                                email={user?.email || ""}
                                hash_id={user?.hash_id || ""}
                                invoice_id={orderResult.invoice_number}
                                event_title={event.title}
                                event_price={formatRupiah(event.price)}
                                event_qty="1"
                                status={orderStatus} // ← kirim status
                            />
                        </RevealSection>
                    )}
                </div>
            </div>
        </Container>
    );
}