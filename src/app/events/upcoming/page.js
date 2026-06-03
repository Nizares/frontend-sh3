"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { concateDate } from "@/src/lib/utils";
import { eventService } from "@/src/services/eventService";
import SponsorSection from "@/src/components/SponsorSection";

export default function UpcomingEvents() {
    const [event, setEvent] = useState(null);
    const [myOrder, setMyOrder] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const searchParams = useSearchParams();

    const formatRupiah = (angka) => new Intl.NumberFormat("id-ID").format(angka);


    useEffect(() => {
        const eventId = searchParams.get("id") ?? 1;

        // 1. Ambil detail event
        eventService.getById(eventId)
            .then(res => setEvent(res.data.data))
            .catch(err => console.error(err));

        // 2. Cek apakah user sudah join event ini
        const token = localStorage.getItem("token");
        if (token) {
            eventService.getMyEvents()
                .then(res => {
                    const myEvents = res.data.data;
                    const joined = myEvents.find(e => e.id === Number(eventId));
                    if (joined) setMyOrder(joined.order);
                })
                .catch(() => { });

            eventService.getById(eventId)
                .then(res => {
                    console.log("Full event response:", res.data.data);
                    console.log("Sponsors:", res.data.data.sponsors);
                    setEvent(res.data.data);
                })
                .catch(err => console.error(err));
        }
    }, [searchParams]);



    async function handleLihatQR() {
        if (qrCode) {
            setShowQR(!showQR);
            return;
        }

        setQrLoading(true);
        try {
            const res = await eventService.book(event.id);
            console.log("Response book:", res.data); // ← tambah ini
            const qr = res.data.data.attendance?.qr_code_svg;
            console.log("QR code:", qr); // ← tambah ini
            if (qr) {
                setQrCode(qr);
                setShowQR(true);
            }
        } catch (err) {
            console.log("Error response:", err.response?.data); // ← tambah ini
            const qr = err.response?.data?.data?.attendance?.qr_code_image;
            console.log("QR dari error:", qr); // ← tambah ini
            if (qr) {
                setQrCode(qr);
                setShowQR(true);
            }
        } finally {
            setQrLoading(false);
        }
    }

    function higherPrice(event_price) {
        if (event_price > 0) {
            return event_price * 2;
        } else {
            return 1000000;
        }
    }

    if (!event) return <div className="flex justify-center p-16 text-2xl">Loading...</div>;

    const isPaid = myOrder?.status === "paid" || myOrder?.status === "free";
    const isPending = myOrder?.status === "pending";

    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <div className="mt-8 max-w-306 mx-auto">
                <Link href="/events" className="static md:absolute">
                    <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                </Link>
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-4xl font-bold font-young">{event.title}</h1>
                </div>

                <div className="flex flex-row justify-between gap-x-2 mt-8">
                    <div className="flex flex-row justify-center gap-x-2 w-1/2">
                        <MapPinIcon className="w-8 h-8" />
                        <div className="text-lg font-bold">{event.location}</div>
                    </div>
                    <div className="text-lg font-bold">{concateDate(event.start_date, event.end_date)}</div>
                </div>

                <Image
                    src={event.image_url}
                    alt={event.title}
                    width={600}
                    height={450}
                    className="h-128 w-full flex object-cover mt-4"
                />

                <div className="grid grid-rows-1 gap-x-16 md:grid-cols-3 mt-8">
                    <div className="col-span-1 flex flex-col md:col-span-2">
                        <h2 className="text-2xl font-bold font-young">Tentang Event</h2>
                        <div className="text-sm">{event.description}</div>

                        {/* Belum join → Daftar Sekarang */}
                        {!myOrder && (
                            <Link href={`/events/register?id=${event.id}`}>
                                <div className="flex justify-center items-center font-young bg-secondary-bg h-32 font-bold text-2xl text-white hover:bg-secondary-bg-hover m-10 md:text-5xl active:bg-secondary-bg-active">
                                    Daftar Sekarang
                                </div>
                            </Link>
                        )}

                        {/* Sudah join tapi belum dikonfirmasi admin */}
                        {isPending && (
                            <div className="flex flex-col gap-2 m-10">
                                <div className="flex justify-center items-center font-young bg-neutral-bg h-20 font-bold text-xl text-white cursor-not-allowed">
                                    Menunggu Konfirmasi Admin
                                </div>
                                <p className="text-center text-sm text-gray-500">
                                    Pembayaranmu sedang diverifikasi. Silakan cek kembali nanti.
                                </p>
                            </div>
                        )}

                        {/* Sudah dikonfirmasi → QR + Lihat Peserta */}
                        {isPaid && (
                            <div className="flex flex-col gap-4 m-10">
                                <button
                                    onClick={handleLihatQR}
                                    disabled={qrLoading}
                                    className={`flex justify-center items-center h-20 font-bold text-2xl text-white transition-colors
                                    ${qrLoading ? "bg-neutral-bg" : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"}`}
                                >
                                    {qrLoading ? "Memuat..." : showQR ? "Sembunyikan Tiket QR" : "Lihat Tiket QR"}
                                </button>

                                <Link href={`/events/members?id=${event.id}`}>
                                    <div className="flex justify-center items-center  font-young h-20 font-bold text-2xl text-secondary-bg bg-transparent border-2 border-secondary-bg hover:border-transparent hover:bg-secondary-bg hover:text-white active:border-transparent active:bg-secondary-bg active:text-white focus:border-transparent focus:bg-secondary-bg focus:text-white transition-all">
                                        Lihat Peserta
                                    </div>
                                </Link>
                            </div>
                        )}


                    </div>

                    <div className="bg-primary-light gap-x-4 p-4 border-2 border-neutral-normal text-neutral-normal">
                        <div className="flex flex-col">
                            <h3 className="text-2xl font-bold font-young">Early Bid</h3>
                            <div className="text-sm line-through">Rp. {formatRupiah(higherPrice(event.price))}</div>
                            <div className="text-lg font-bold">Rp. {formatRupiah(event.price)}/person</div>
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

                </div>
                {/* Tampilan QR Code */}
                {isPaid && showQR && qrCode && (
                    <div className="flex flex-col items-center gap-4 bg-primary-light border-2 border-neutral-normal p-8 mb-10 mt-8">
                        <div className="text-xl font-bold">Tiket QR Kamu</div>

                        <img
                            src={`data:image/svg+xml;base64,${qrCode}`}
                            alt="QR Code Tiket"
                            className="w-64 h-64"
                        />

                        <div className="text-sm text-center">
                            Tunjukkan QR ini saat check-in di Acara
                        </div>
                        <div className="text-2xl font-young px-4 py-2 text-neutral-dark bg-neutral-bg lining-nums">
                            {myOrder?.ticket_code}
                        </div>
                    </div>
                )}

                {event.sponsors && (
                    <SponsorSection sponsors={event.sponsors} />
                )}
            </div>
        </Container>
    );
}