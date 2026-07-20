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

import { useAuth } from "@/src/contexts/AuthContext"; // ← pakai AuthContext
import { eventService } from "@/src/services/eventService";
import { orderService } from "@/src/services/orderService";

import { concateDate, formatRupiah } from "@/src/lib/utils";
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
    const { user, isLoggedIn, loading: authLoading } = useAuth(); // ← dari AuthContext
    const [event, setEvent] = useState(null);
    const [payOptions, setPayOptions] = useState("");
    const [paymentFile, setPaymentFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [orderResult, setOrderResult] = useState(null);

    const selectedBank = paymentOptions.find((p) => p.value === payOptions);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("id") || 1;
        eventService
            .getById(eventId)
            .then((res) => setEvent(res.data.data))
            .catch((err) => console.error(err));
    }, []);

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
                    window.location.href = "/members/detail";
                }
            });
            return;
        }

        if (!paymentFile) {
            Swal.fire({ icon: "warning", title: "Upload bukti bayar dulu!" });
            return;
        }

        // 🔥 PAKAI HASH_ID sebagai participant_id
        const participantId = user?.hash_id;
        console.log("🔵 Participant ID (hash_id):", participantId);

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

            if (order.status === "free") {
                setOrderResult({ order_id: orderId, invoice_number, ticket_code });
                Swal.fire({
                    icon: "success",
                    title: "Pendaftaran Berhasil!",
                    text: "Event ini gratis! Tiket kamu sudah aktif.",
                });
                return;
            }

            const formData = new FormData();
            formData.append("payment_proof", paymentFile);
            formData.append("payment_method", payOptions || "transfer");
            formData.append("amount", event.price);
            formData.append(
                "paid_at",
                new Date().toISOString().slice(0, 19).replace("T", " ")
            );

            await orderService.uploadPayment(orderId, formData);

            setOrderResult({ order_id: orderId, invoice_number, ticket_code });
        } catch (err) {
            console.error("🔴 Order error:", err.response?.data);
            setOrderResult(null);
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

    if (!event)
        return <div className="flex justify-center p-16 text-2xl">Loading...</div>;

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

                                {/* 🔥 CEK STATUS LOGIN */}
                                {authLoading ? (
                                    <div className="text-center py-8 text-xl">Loading...</div>
                                ) : isLoggedIn && user ? (
                                    // ✅ SUDAH LOGIN - Tampilkan data user
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
                                    // ❌ BELUM LOGIN - Tampilkan pesan login
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
                                        Rp. {formatRupiah(event.price)}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-xl font-bold">Total</div>
                                    <div className="text-2xl font-bold">
                                        Rp. {formatRupiah(event.price)}
                                    </div>
                                </div>
                            </div>
                        </RevealSection>

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

                            <RevealSection direction="up">
                                <div className="flex flex-col gap-4">
                                    <button
                                        className={`flex justify-center font-young rounded-md items-center ${submitLoading ? "bg-neutral-normal-active" : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"}  h-16 font-bold text-xl text-white m-10 md:text-3xl`}
                                        type="submit"
                                        disabled={submitLoading || !isLoggedIn}
                                    >
                                        {submitLoading ? "Memproses..." : "Confirm Payment"}
                                    </button>
                                    {!isLoggedIn && (
                                        <p className="text-center text-red-500 font-medium">
                                            *Login terlebih dahulu untuk melanjutkan pembayaran
                                        </p>
                                    )}
                                </div>
                            </RevealSection>
                        </div>
                    </Form>

                    {orderResult && (
                        <RevealSection direction="up">
                            <InvoiceEvent
                                name={user?.name || ""}
                                email={user?.email || ""}
                                hash_id={user?.hash_id || ""}
                                invoice_id={orderResult.invoice_number}
                                event_title={event.title}
                                event_price={formatRupiah(event.price)}
                                event_qty="1"
                            />
                        </RevealSection>
                    )}
                </div>
            </div>
        </Container>
    );
}