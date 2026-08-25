"use client";

import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import { concateDate, formatRupiah } from "@/src/lib/utils";
import { eventService } from "@/src/services/eventService";
import { galleryService } from "@/src/services/galleryService";
import SponsorSection from "@/src/components/SponsorSection";
import BatikOverlay from "@/src/components/BatikOverlay";
import QRCode from 'qrcode';
import Swal from "sweetalert2";
import EventGallery from "@/src/components/EventGallery";
import Pagination from "@/src/components/Pagination";

export default function UpcomingEvents() {
    const [event, setEvent] = useState(null);
    const [myOrder, setMyOrder] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const [attendanceCode, setAttendanceCode] = useState(null);
    const [eventId, setEventId] = useState(null);
    const [albums, setAlbums] = useState([]);

    // Pagination untuk gallery
    const [galleryPage, setGalleryPage] = useState(1);
    const itemsPerPage = 6;

    const generateQR = async (qrString) => {
        if (!qrString) return null;
        try {
            return await QRCode.toDataURL(qrString, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                }
            });
        } catch (err) {
            console.error("Gagal generate QR:", err);
            return null;
        }
    };

    const setQRFromData = async (data) => {
        const qrImage = data?.attendance?.qr_code_image || data?.qr_code_image || null;
        const qrString = data?.attendance?.qr_code || data?.qr_code || data?.ticket_code || null;

        if (qrImage) {
            setQrCode(qrImage);
            setAttendanceCode(qrString);
            return true;
        } else if (qrString) {
            const generatedQR = await generateQR(qrString);
            if (generatedQR) {
                setQrCode(generatedQR);
                setAttendanceCode(qrString);
                return true;
            } else {
                setAttendanceCode(qrString);
                return true;
            }
        }
        return false;
    };

    const isRegistrationOpen = () => {
        if (!event) return false;

        const now = new Date();
        const regStart = new Date(event.registration_start_date);
        const regEnd = new Date(event.registration_end_date);

        return now >= regStart && now <= regEnd;
    };

    const isEventCompleted = () => {
        if (!event) return false;
        const now = new Date();
        const endDate = new Date(event.end_date);
        return now > endDate;
    };

    const getRegistrationStatus = () => {
        if (!event) return { text: "Daftar Sekarang", disabled: false };

        const now = new Date();
        const regStart = new Date(event.registration_start_date);
        const regEnd = new Date(event.registration_end_date);

        if (now < regStart) {
            return {
                text: `Pendaftaran dibuka ${new Date(regStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                disabled: true
            };
        }
        if (now > regEnd) {
            return {
                text: "Pendaftaran sudah ditutup",
                disabled: true
            };
        }
        return { text: "Daftar Sekarang", disabled: false };
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id") ?? 1;
        setEventId(id);

        // Fetch event detail
        eventService
            .getById(id)
            .then((res) => setEvent(res.data.data))
            .catch(console.error);

        // Fetch albums untuk link Google Drive
        galleryService
            .getAlbums()
            .then((res) => {
                const allAlbums = res.data?.data || [];
                const eventAlbums = allAlbums.filter(
                    (album) => album.event_id === Number(id)
                );
                setAlbums(eventAlbums);
            })
            .catch(() => {
                // Silent fail
            });

        // Cek order user
        const token = localStorage.getItem("token");
        if (token) {
            eventService
                .getMyEvents()
                .then(async (res) => {
                    const joined = res.data.data.find((e) => e.id === Number(id));
                    if (joined) {
                        setMyOrder(joined.order);
                        if (joined.order.status === "paid" || joined.order.status === "confirmed" || joined.order.status === "free") {
                            await setQRFromData(joined.order);
                        }
                    }
                })
                .catch(() => {});
        }
    }, []);

    async function handleLihatQR() {
        if (qrCode) {
            setShowQR(!showQR);
            return;
        }

        setQrLoading(true);
        try {
            const res = await eventService.book(event.id);
            const data = res.data.data;
            const success = await setQRFromData(data);
            if (success) {
                setShowQR(true);
            } else {
                console.warn("Tidak ada QR Code ditemukan");
            }
        } catch (err) {
            const errorData = err.response?.data?.data;
            if (errorData) {
                const success = await setQRFromData(errorData);
                if (success) {
                    setShowQR(true);
                }
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

    function handleDownloadQR() {
        if (!qrCode) return;

        const link = document.createElement("a");
        link.href = qrCode;
        link.download = `tiket-${attendanceCode || myOrder?.ticket_code || 'qr'}.png`;
        link.click();
    }

    // Cek apakah address adalah link/iframe
    const isAddressLink = (address) => {
        if (!address) return false;
        return address.startsWith('http') ||
            address.includes('google.com/maps') ||
            address.includes('iframe') ||
            address.includes('embed');
    };

    // Extract embed URL dari address
    const extractEmbedUrl = (address) => {
        if (!address) return null;

        if (address.startsWith('http')) {
            return address;
        }

        const srcMatch = address.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
            return srcMatch[1];
        }

        return null;
    };

    // Format maps link
    const getMapsLinkFromAddress = (address) => {
        if (!address) return "#";
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    };

    // Format tanggal dengan end date
    const formatEventDate = () => {
        if (!event) return "";

        const start = new Date(event.start_date);
        const end = new Date(event.end_date);

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };

        const startDate = start.toLocaleDateString('id-ID', options);
        const startTime = start.toLocaleTimeString('id-ID', timeOptions);
        const endDate = end.toLocaleDateString('id-ID', options);
        const endTime = end.toLocaleTimeString('id-ID', timeOptions);

        if (startDate === endDate) {
            return `${startDate} · ${startTime} - ${endTime} WITA`;
        }

        return `${startDate} ${startTime} - ${endDate} ${endTime} WITA`;
    };

    // Gallery pagination handler
    const handleGalleryPageChange = (page) => {
        setGalleryPage(page);
    };

    if (!event)
        return <div className="flex justify-center p-16 text-2xl mt-16 h-screen">Loading...</div>;

    const isPaid = myOrder?.status === "paid" || myOrder?.status === "confirmed" || myOrder?.status === "free";
    const isPending = myOrder?.status === "pending";
    const isCancelled = myOrder?.status === "cancelled" || myOrder?.status === "rejected";

    const regStatus = getRegistrationStatus();
    const isRegistrationAvailable = isRegistrationOpen() && !isEventCompleted();

    const bannerImage = event.banner_url || event.image_url || "/assets/images/placeholder-event.jpg";
    const detailImage = event.image_url || event.banner_url || "/assets/images/placeholder-event.jpg";
    const hasDetailImage = detailImage && detailImage !== "/assets/images/placeholder-event.jpg";

    const addressIsLink = isAddressLink(event.address);
    const embedUrl = extractEmbedUrl(event.address);

    // Gallery data dari event (featured only dari backend)
    const galleries = event.galleries || [];
    const totalGalleryPages = Math.ceil(galleries.length / itemsPerPage);
    const startIndex = (galleryPage - 1) * itemsPerPage;
    const paginatedGalleries = galleries.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
                <BatikOverlay />
                <div className="mt-8 max-w-306 mx-auto relative z-1">
                    <Link href="/events" className="static md:absolute">
                        <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                    </Link>
                    <div className="flex items-center justify-center w-full">
                        <h1 className="text-4xl font-bold mt-16">{event.title}</h1>
                    </div>

                    {/* Location & Date - 2 Kolom SAMA UKURAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Kolom Kiri - Lokasi */}
                        <div className="flex flex-col p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
                            <div className="flex flex-row items-start gap-x-3">
                                <MapPinIcon className="w-6 h-6 text-secondary-bg flex-shrink-0 mt-0.5" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-semibold">{event.location}</span>
                                    {event.address && !addressIsLink && (
                                        <span className="text-xs text-neutral-dark line-clamp-2">
                                            {event.address}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Iframe Maps */}
                            {addressIsLink && embedUrl && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-neutral-normal/50 w-full">
                                    <iframe
                                        src={embedUrl}
                                        width="100%"
                                        height="256"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Maps"
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan - Tanggal & Waktu + Detail Image */}
                        <div className="flex flex-col p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
                            <div className="flex flex-row items-start gap-x-3">
                                <CalendarDaysIcon className="w-6 h-6 text-secondary-bg flex-shrink-0 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">Tanggal & Waktu</span>
                                    <span className="text-sm text-neutral-dark">
                                        {formatEventDate()}
                                    </span>
                                    {event.start_date && event.end_date && (
                                        <span className="text-xs text-neutral-dark/60 mt-0.5">
                                            {new Date(event.start_date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                            {new Date(event.start_date).toLocaleDateString('id-ID', { weekday: 'long' }) !==
                                                new Date(event.end_date).toLocaleDateString('id-ID', { weekday: 'long' }) &&
                                                ` - ${new Date(event.end_date).toLocaleDateString('id-ID', { weekday: 'long' })}`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Detail Image - Meeting Point */}
                            {hasDetailImage && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-neutral-normal/50 w-full">
                                    <div className="relative w-full h-64">
                                        <img
                                            src={detailImage}
                                            alt="Titik Kumpul"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/assets/images/placeholder-event.jpg";
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="relative w-full h-64 md:h-80 mt-4 rounded-lg overflow-hidden bg-gray-200">
                        <img
                            src={bannerImage}
                            alt={`${event.title} - Banner`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/assets/images/placeholder-event.jpg";
                            }}
                        />
                    </div>

                    {/* Title & Category */}
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold">{event.title}</h2>
                        <p className="text-sm text-neutral-dark">{event.category?.name || "Event"}</p>
                    </div>

                    <div className="grid grid-rows-1 gap-x-16 md:grid-cols-3 my-6 mx-4 md:mx-0">
                        <div className="col-span-1 flex flex-col md:col-span-2">
                            <h2 className="text-xl font-bold mt-2">Tentang Event</h2>
                            <div className="text-sm text-justify">{event.description}</div>

                            {!myOrder && !isRegistrationAvailable && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
                                    <p className="text-yellow-700 font-medium">
                                        {regStatus.text}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Pendaftaran dibuka: {new Date(event.registration_start_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Ditutup: {new Date(event.registration_end_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}

                            {!myOrder && (
                                <Link
                                    href={isRegistrationAvailable ? `/events/register?id=${event.id}` : "#"}
                                    onClick={(e) => {
                                        if (!isRegistrationAvailable) {
                                            e.preventDefault();
                                            Swal.fire({
                                                icon: "info",
                                                title: "Pendaftaran Belum Dibuka",
                                                text: regStatus.text,
                                                confirmButtonText: "OK",
                                            });
                                        }
                                    }}
                                >
                                    <div
                                        className={`flex justify-center items-center rounded-md h-32 font-bold text-2xl m-6 md:m-10 md:text-5xl transition-colors text-center ${isRegistrationAvailable
                                                ? "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active cursor-pointer text-white"
                                                : "bg-neutral-normal cursor-not-allowed text-white/70"
                                            }`}
                                    >
                                        {regStatus.text}
                                    </div>
                                </Link>
                            )}

                            {isPending && (
                                <div className="flex flex-col gap-2 m-6 md:m-10">
                                    <div className="flex justify-center items-center bg-neutral-normal-active h-20 font-bold text-xl text-white cursor-not-allowed rounded-md text-center">
                                        Menunggu Konfirmasi Admin
                                    </div>
                                    <p className="text-center text-sm text-gray-500 rounded-md">
                                        Pembayaranmu sedang diverifikasi. Silakan cek kembali nanti.
                                    </p>
                                </div>
                            )}

                            {isCancelled && (
                                <>
                                    <div className="flex flex-col gap-2 m-6 md:m-10">
                                        <div className="flex justify-center items-center bg-red-500 h-20 font-bold text-xl text-white cursor-not-allowed rounded-md">
                                            Ordermu Telah dibatalkan
                                        </div>
                                        <p className="text-center text-sm text-gray-500 rounded-md">
                                            Ordermu telah dibatalkan oleh Admin, silahkan menghubungi admin untuk informasi lebih lanjut
                                        </p>
                                    </div>
                                    <Link href={`/events/register?id=${event.id}`}>
                                        <div className="cursor-pointer flex justify-center items-center rounded-md bg-secondary-bg h-32 font-bold text-2xl text-white hover:bg-secondary-bg-hover m-6 md:m-10 md:text-5xl active:bg-secondary-bg-active">
                                            Daftar Sekarang
                                        </div>
                                    </Link>
                                </>
                            )}

                            {isPaid && (
                                <div className="flex flex-col gap-4 m-6 md:m-10">
                                    <button
                                        onClick={handleLihatQR}
                                        disabled={qrLoading}
                                        className={`flex justify-center items-center h-20 font-bold text-2xl text-white transition-colors rounded-md
                                            ${qrLoading ? "bg-neutral-normal-active cursor-not-allowed" : "cursor-pointer bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"}`}
                                    >
                                        {qrLoading
                                            ? "Memuat..."
                                            : showQR
                                                ? "Sembunyikan Tiket QR"
                                                : "Lihat Tiket QR"}
                                    </button>

                                    <Link href={`/events/members?id=${event.id}`}>
                                        <div className="flex justify-center items-center rounded-md font-young h-20 font-bold text-2xl text-secondary-bg bg-transparent border-2 border-secondary-bg hover:border-transparent hover:bg-secondary-bg hover:text-white active:border-transparent active:bg-secondary-bg active:text-white focus:border-transparent focus:bg-secondary-bg focus:text-white transition-all">
                                            Lihat Peserta
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="bg-primary-light gap-x-4 p-4 border-4 border-primary-normal text-primary-normal rounded-md mt-4 md:mt-0">
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-bold font-young">Early Bid</h3>
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
                                <div className="text-xl font-bold mt-2">Event Organizer</div>
                                <div className="text-lg font-semibold">{event.creator?.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code */}
                    {isPaid && showQR && (
                        <div className="flex flex-col items-center gap-4 bg-primary-light border-2 border-neutral-normal p-8 mb-10 mt-8 rounded-md">
                            <div className="text-xl font-bold">Tiket QR Kamu</div>

                            <div className="p-8 bg-white rounded-md">
                                {qrCode ? (
                                    <img
                                        src={qrCode}
                                        alt="QR Code Tiket"
                                        className="w-64 h-64"
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-md">
                                        <div className="text-xl font-mono font-bold tracking-wider text-gray-600">
                                            {attendanceCode || myOrder?.ticket_code || "QR Code"}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-sm text-center">
                                Tunjukkan QR ini saat check-in di Acara
                            </div>
                            <div className="text-2xl font-young px-4 py-2 text-neutral-dark bg-neutral-bg lining-nums rounded-md">
                                {attendanceCode ?? myOrder?.ticket_code}
                            </div>

                            {qrCode && (
                                <button
                                    onClick={handleDownloadQR}
                                    className="cursor-pointer flex justify-center items-center gap-2 bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active text-white font-bold px-8 py-3 font-young rounded-md"
                                >
                                    Download QR
                                </button>
                            )}
                        </div>
                    )}

                    {/* 🔥 GALLERY SECTION - Featured Photos */}
                    {galleries.length > 0 && (
                        <div className="mt-8 mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold font-young">Galeri Event</h2>
                                {totalGalleryPages > 1 && (
                                    <span className="text-sm text-neutral-dark">
                                        Halaman {galleryPage} dari {totalGalleryPages}
                                    </span>
                                )}
                            </div>
                            
                            <EventGallery images={paginatedGalleries} />

                            {totalGalleryPages > 1 && (
                                <Pagination 
                                    currentPage={galleryPage}
                                    totalPages={totalGalleryPages}
                                    onPageChange={handleGalleryPageChange}
                                />
                            )}
                        </div>
                    )}

                    {/* 🔥 ALBUM DRIVE SECTION - Link ke Google Drive */}
                    {albums.length > 0 && (
                        <div className="mt-8 mb-10 bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold font-young mb-4">Album Lengkap</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Lihat semua foto dan video dari event ini di Google Drive
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {albums.map((album) => (
                                    <div 
                                        key={album.id} 
                                        className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 hover:border-blue-300 transition-colors"
                                    >
                                        <span className="font-medium">{album.title}</span>
                                        <span className="text-xs text-gray-400">
                                            ({album.galleries_count || 0} media)
                                        </span>
                                        {album.gdrive_folder_url && (
                                            <a
                                                href={album.gdrive_folder_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M4.59 6.89c.7-.71 1.4-1.42 2.11-2.12l2.12 2.12-2.12 2.12L4.59 6.89zm13.53 13.53l-2.12-2.12 2.12-2.12 2.12 2.12-2.12 2.12zM11.5 3.5h1v14h-1v-14zm-1 15h3v1h-3v-1z"/>
                                                </svg>
                                                Buka di Drive →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Merchandise */}
                    {event.merchandise?.length > 0 && (
                        <div className="mt-8 mb-10">
                            <h2 className="text-2xl font-bold font-young mb-4 text-primary-darker">Merchandise Event</h2>
                            <p className="text-sm text-neutral-dark mb-4">
                                {isPaid ? "Harga spesial khusus peserta event ini" : "Dapatkan harga spesial dengan mendaftar event!"}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {event.merchandise.map(item => {
                                    const originalPrice = Number(item.price) || 0;
                                    const eventPrice = Number(item.event_price) || 0;
                                    const hasDiscount = eventPrice > 0 && eventPrice < originalPrice;
                                    const finalPrice = isPaid && hasDiscount ? eventPrice : originalPrice;
                                    const discountPercent = hasDiscount
                                        ? Math.round((1 - eventPrice / originalPrice) * 100)
                                        : 0;

                                    let orderUrl = `/merchandise/order?id=${item.id}`;
                                    if (isPaid && hasDiscount) {
                                        orderUrl += `&event_id=${event.id}&event_price=${finalPrice}&discount_percentage=${discountPercent}`;
                                    }

                                    return (
                                        <div key={item.id} className="flex flex-col bg-primary-light border-2 border-neutral-normal hover:border-secondary-bg transition-colors rounded-md">
                                            <div className="relative w-full h-[250px] overflow-hidden bg-neutral-bg">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-dark text-4xl font-bold font-young">
                                                        {item.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                {hasDiscount && (
                                                    <div className="absolute top-2 left-2 bg-secondary-bg text-white text-xs font-bold px-2 py-1">
                                                        -{discountPercent}%
                                                    </div>
                                                )}
                                                {item.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">Habis</span>
                                                    </div>
                                                )}
                                                {item.stock_status === "limited" && (
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1">
                                                        Sisa {item.stock}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 flex flex-col gap-1 flex-1">
                                                <div className="flex flex-col gap-1 flex-1">
                                                    <div className="font-semibold text-sm line-clamp-2">{item.name}</div>
                                                    {hasDiscount ? (
                                                        <div className="flex flex-col">
                                                            <div className="text-xs text-neutral-dark line-through">
                                                                Rp {formatRupiah(originalPrice)}
                                                            </div>
                                                            <div className="font-bold text-secondary-bg">
                                                                Rp {formatRupiah(eventPrice)}
                                                            </div>
                                                            {!isPaid && (
                                                                <div className="text-xs text-secondary-bg font-medium mt-1">
                                                                    Harga spesial untuk peserta event
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="font-bold text-secondary-bg">
                                                            Rp {formatRupiah(originalPrice)}
                                                        </div>
                                                    )}
                                                    {item.sizes?.length > 0 && (
                                                        <div className="text-xs text-neutral-dark">
                                                            Size: {item.sizes.join(", ")}
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={orderUrl}
                                                    className={`mt-2 text-white text-center px-5 py-2.5 text-sm font-medium transition-colors font-young shadow-md
                                                        ${item.stock === 0
                                                            ? "bg-neutral-normal pointer-events-none opacity-60"
                                                            : isPaid && hasDiscount
                                                                ? "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"
                                                                : "bg-primary-bg hover:bg-primary-bg-hover active:bg-primary-bg-active"
                                                        }`}
                                                >
                                                    {item.stock === 0 ? "Habis" : isPaid && hasDiscount ? "Pesan (Spesial)" : "Pesan"}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Sponsors */}
                    {event.sponsors && <SponsorSection sponsors={event.sponsors} />}
                </div>
            </div>
        </Container>
    );
}