"use client"

import Image from "next/image";
import Link from "next/link";
import Form from "next/form";

import Container from "@/src/components/Container";
import SelectInput from "@/src/components/SelectInput";
import InputType from "@/src/components/Inputs";
import ImageUpload from "@/src/components/ImageUpload";
import InvoiceEvent from "@/src/components/InvoiceEvent";
import { RevealSection } from "@/src/components/RevealSection";

import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

import useSearchDataMembers from "@/src/hooks/useSearchDataMembers";
import { eventService } from "@/src/services/eventService";
import { orderService } from "@/src/services/orderService";

import { concateDate, formatRupiah } from "@/src/lib/utils";
import Swal from "sweetalert2";

const paymentOptions = [
    { value: "Transfer Bank BCA", label: "Bank Transfer BCA", NoRek: "0273178314", nama: "Muhammad Nizar", image: "/assets/icon/bca.png" },
    { value: "Transfer Bank Mandiri", label: "Bank Transfer Mandiri", NoRek: "14400000011", nama: "Muhammad Nizar", image: "/assets/icon/mandiri.png" },
    { value: "Transfer Bank BRI", label: "Bank Transfer BRI", NoRek: "14400000011", nama: "Muhammad Nizar", image: "/assets/icon/bri.png" },
    { value: "Transfer saldo DANA", label: "DANA", NoRek: "08123456789", nama: "Muhammad Nizar", image: "/assets/icon/dana.png" },
    { value: "Transfer saldo OVO", label: "OVO", NoRek: "08123456789", nama: "Muhammad Nizar", image: "/assets/icon/ovo.png" },
    { value: "Transfer saldo gopay", label: "GoPay", NoRek: "08123456789", nama: "Muhammad Nizar", image: "/assets/icon/gopay.png" },
]

export default function RegisterEvent() {
    const [event, setEvent] = useState(null);
    const [payOptions, setPayOptions] = useState("");
    const [paymentFile, setPaymentFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [orderResult, setOrderResult] = useState(null);

    const selectedBank = paymentOptions.find(p => p.value === payOptions);
    const { loading, id, setId, userData, error, checkTheID } = useSearchDataMembers();

    // Ambil event ID dari URL, contoh: /events/register?id=1
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("id") || 1; // fallback ke 1 sementara
        eventService.getById(eventId)
            .then(res => setEvent(res.data.data))
            .catch(err => console.error(err));
    }, []);

    async function submitPembayaran(e) {
        e.preventDefault();

        console.log("Token:", localStorage.getItem("token"));
        console.log("userData:", userData);
        console.log("userData.id:", userData?.id);
        console.log("event.id:", event?.id);
        if (!userData) {
            Swal.fire({ icon: "warning", title: "Cek ID Hash dulu!", text: "Kamu harus cek ID Hash sebelum melanjutkan." });
            return;
        }
        if (!paymentFile) {
            Swal.fire({ icon: "warning", title: "Upload bukti bayar dulu!" });
            return;
        }

        setSubmitLoading(true);
        try {

            // Step 1: Buat order
            console.log("participant_id dikirim:", userData.id);
            const orderRes = await orderService.create(event.id, userData.id);
            const orderId = orderRes.data.data.id;
            const { order_id, invoice_number, ticket_code } = orderRes.data.data;


            // Step 2: Upload bukti bayar
            const formData = new FormData();
            formData.append("payment_proof", paymentFile);
            formData.append("payment_method", payOptions || "transfer");
            formData.append("amount", event.price);
            formData.append("paid_at", new Date().toISOString().slice(0, 19).replace("T", " "));

            console.log(formData);


            await orderService.uploadPayment(orderId, formData);

            setOrderResult({ order_id, invoice_number, ticket_code });

            Swal.fire({
                icon: "success",
                title: "Pendaftaran Berhasil!",
                text: "Bukti pembayaran kamu sedang diverifikasi.",
            });
        } catch (err) {
            setOrderResult(null);

            console.log("Error detail:", err.response?.data?.errors);
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
            });
        } finally {
            setSubmitLoading(false);
        }
    }

    if (!event) return <div className="flex justify-center p-16 text-2xl">Loading...</div>;

    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <RevealSection direction="up">
                <div className="flex flex-col gap-y-4 mt-8">
                    <Link href="/events" className="static md:absolute">
                        <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                    </Link>
                    <div className="flex items-center justify-center w-full">
                        <h1 className="text-4xl font-bold">{event.title}</h1>
                    </div>

                    <div className="flex flex-row justify-between gap-x-2">
                        <div className="flex flex-row justify-center gap-x-2">
                            <MapPinIcon className="w-8 h-8" />
                            <div className="text-lg font-bold">{event.location}</div>
                        </div>
                        <div className="text-lg font-bold">{concateDate(event.start_date, event.end_date)}</div>
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
                <div className="text-5xl font-bold p-8">TICKET #PENDING</div>

                <div className="flex justify-center gap-8 flex-col md:flex-row">
                    <div className="bg-card-bg rounded-lg p-4 w-full">
                        <div className="flex flex-col">
                            <h3 className="text-2xl font-bold">Early Bid</h3>
                            <div className="text-sm line-through">Rp. 1.400.000</div>
                            <div className="text-lg font-bold">Rp. {formatRupiah(event.price)}/person</div>
                        </div>
                        <div className="flex flex-col">
                            <ol className="list-decimal list-inside p-2">
                                {event.key_points?.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ol>
                            <div className="text-xl font-bold">Event Organizer</div>
                            <div className="text-lg font-semibold">{event.organizer?.name}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-card-bg rounded-lg p-4 w-full">
                        <div className="font-bold text-3xl">Slot Tersisa:</div>
                        <div className="font-bold text-5xl">{event.remaining_quota}</div>
                    </div>
                </div>
            </RevealSection>


            <Form onSubmit={submitPembayaran} className="flex flex-col gap-8">
                <RevealSection direction="up">
                    <div className="flex flex-col bg-card-bg rounded-lg p-4 gap-4">
                        <div className="flex justify-between">
                            <div className="text-2xl font-bold">Customer Information</div>
                            <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                        </div>
                        <hr className="border-t-2 border-text-colors" />
                        <div className="grid grid-cols-2 w-full items-center md:grid-cols-3 gap-8">
                            <InputType
                                label="ID Hash"
                                id="hashid"
                                type="text"
                                name="idhash"
                                required
                                placeholder="HASH000001"
                                className="flex flex-col gap-2 col-span-1 md:col-span-2"
                                onChange={e => setId(e.target.value)}
                                value={id}
                            />
                            <button
                                className={`flex justify-center items-center rounded-2xl ${loading ? "bg-gray-500" : "bg-btn-green-normal hover:to-btn-green-hover"} active:bg-green-400 font-bold text-xl text-white md:text-2xl w-full h-full`}
                                type="button"
                                disabled={loading}
                                onClick={checkTheID}
                            >
                                {loading ? "Checking..." : "Check ID"}
                            </button>
                        </div>
                        {error && <p className="text-red-500 font-medium text-3xl">{error}</p>}

                        {userData && (
                            <RevealSection direction="up">
                                <>
                                    <InputType label="Full Name" id="name" required type="text" name="fullname"
                                        placeholder="John Doe" className="flex flex-col gap-2"
                                        value={userData.name} readOnly />
                                    <InputType label="Email" id="email" required type="email" name="email"
                                        placeholder="you@example.com" className="flex flex-col gap-2"
                                        value={userData.email} readOnly />
                                    <InputType label="Nomor Telepon/WA" type="text" id="telpnumber" required
                                        name="telpnumber" placeholder="08123456789" className="flex flex-col gap-2"
                                        value={userData.telp_number} readOnly />
                                </>
                            </RevealSection>
                        )}
                    </div>
                </RevealSection>

                <RevealSection direction="up">
                    <div className="flex flex-col bg-card-bg rounded-lg p-4 gap-4">
                        <div className="flex justify-between">
                            <div className="text-2xl font-bold">Payment Details</div>
                            <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                        </div>
                        <hr className="border-t-2 border-text-colors" />
                        <div className="flex justify-between">
                            <div className="text-xl font-medium">Event Name</div>
                            <div className="text-xl font-medium">{event.title}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-xl font-medium">Event Price</div>
                            <div className="text-xl font-medium">Rp. {formatRupiah(event.price)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-xl font-bold">Total</div>
                            <div className="text-2xl font-bold text-orange-400">Rp. {formatRupiah(event.price)}</div>
                        </div>
                    </div>
                </RevealSection>


                <div className="flex flex-col bg-card-bg rounded-lg p-4 gap-4">
                    <RevealSection direction="up">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between">
                                <div className="text-2xl font-bold">Payment Process</div>
                                <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                            </div>
                            <hr className="border-t-2 border-text-colors" />
                            <SelectInput
                                id="payoptions" name="payOptions" label="Payment Options"
                                options={paymentOptions} value={payOptions}
                                placehold="Pilih Pembayaran..."
                                onChange={e => setPayOptions(e.target.value)}
                            />
                            <div className="flex flex-col items-center justify-center p-8">
                                {selectedBank && (
                                    <div className="flex flex-row gap-8">
                                        <Image src={selectedBank.image} alt={selectedBank.nama} width={150} height={100} className="flex object-contain rounded-lg" />
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-lg">{selectedBank.nama}</div>
                                            <div className="font-semibold text-lg">{selectedBank.NoRek}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-2xl font-bold m-8">atau</div>
                                <Image src="/assets/images/qris.jpeg" alt="QRIS" width={450} height={600} className="flex object-cover rounded-lg items-center justify-center" />
                            </div>
                        </div>

                    </RevealSection>

                    <RevealSection direction="up">
                        <div className="flex flex-col gap-4">
                            <div className="text-2xl font-bold">Upload Proof of Payment</div>
                            <ImageUpload
                                id="paymentproof"
                                label="Payment Proof"
                                required
                                onChange={file => setPaymentFile(file)} // ← pastikan ImageUpload support ini
                            />
                        </div>

                    </RevealSection>

                    <RevealSection direction="up">
                        <div className="flex flex-col gap-4">
                            <button
                                className={`flex justify-center items-center rounded-2xl ${submitLoading ? "bg-gray-500" : "bg-btn-green-normal hover:to-btn-green-hover"} active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl`}
                                type="submit"
                                disabled={submitLoading}
                            >
                                {submitLoading ? "Memproses..." : "Confirm Payment"}
                            </button>
                        </div>

                    </RevealSection>
                </div>
            </Form>

            {
                orderResult && (
                    <RevealSection direction="up">
                        <InvoiceEvent
                            name={userData.name}
                            email={userData.email}
                            hash_id={userData?.id}
                            invoice_id={orderResult.invoice_number}
                            event_title={event.title}
                            event_price={formatRupiah(event.price)}
                            event_qty="1"
                        />
                    </RevealSection>
                )
            }



        </Container >
    );
}