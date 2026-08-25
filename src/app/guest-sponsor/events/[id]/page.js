// src/app/guest-sponsor/events/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Container from "@/src/components/Container";
import BatikOverlay from "@/src/components/BatikOverlay";
import { guestSponsorService } from "@/src/services/guestSponsorService";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

export default function GuestSponsorEventDetail({ params }) {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);

    // Unwrap params untuk Next.js 15
    const id = params?.id || params?.eventId;

    useEffect(() => {
        if (!isLoggedIn || user?.role !== "guest_sponsor") {
            router.push("/guest-sponsor/login");
            return;
        }

        if (!id) {
            setError("Event tidak ditemukan");
            setLoading(false);
            return;
        }

        const fetchEvent = async () => {
            try {
                const response = await guestSponsorService.getEventDetail(id);
                setEvent(response.data?.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching event detail:", err);
                if (err.response?.status === 404) {
                    setError("Event tidak ditemukan atau tidak terdaftar untuk sponsor Anda");
                } else if (err.response?.status === 403) {
                    setError("Anda tidak memiliki akses ke event ini");
                } else {
                    setError(err.response?.data?.message || "Gagal memuat event");
                }
                if (err.response?.status === 401) {
                    router.push("/guest-sponsor/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, isLoggedIn, user, router]);

    const handleCheckIn = async () => {
        if (!event) return;

        setCheckingIn(true);
        try {
            await guestSponsorService.checkIn({
                event_id: event.id,
                // QR code bisa dari scan atau manual
            });
            Swal.fire({
                icon: "success",
                title: "Check-in Berhasil!",
                text: `Anda telah check-in untuk event ${event.title}`,
                timer: 2000,
                showConfirmButton: false,
            });
            // Refresh data
            const response = await guestSponsorService.getEventDetail(id);
            setEvent(response.data?.data);
        } catch (err) {
            console.error("Check-in error:", err);
            Swal.fire({
                icon: "error",
                title: "Check-in Gagal",
                text: err.response?.data?.message || "Terjadi kesalahan",
            });
        } finally {
            setCheckingIn(false);
        }
    };

    const handleCheckOut = async () => {
        if (!event) return;

        setCheckingIn(true);
        try {
            await guestSponsorService.checkOut({
                event_id: event.id,
            });
            Swal.fire({
                icon: "success",
                title: "Check-out Berhasil!",
                text: `Anda telah check-out dari event ${event.title}`,
                timer: 2000,
                showConfirmButton: false,
            });
            const response = await guestSponsorService.getEventDetail(id);
            setEvent(response.data?.data);
        } catch (err) {
            console.error("Check-out error:", err);
            Swal.fire({
                icon: "error",
                title: "Check-out Gagal",
                text: err.response?.data?.message || "Terjadi kesalahan",
            });
        } finally {
            setCheckingIn(false);
        }
    };

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

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                    <BatikOverlay />
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-lg">Memuat event...</p>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    if (error || !event) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                    <BatikOverlay />
                    <div className="flex justify-center items-center min-h-screen px-4">
                        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                            <p className="text-xl text-red-600">{error || "Event tidak ditemukan"}</p>
                            <Link href="/guest-sponsor/events" className="text-blue-600 hover:underline mt-4 inline-block">
                                ← Kembali ke Event Saya
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    const isCheckedIn = event.guest_attendance?.check_in_time && !event.guest_attendance?.check_out_time;
    const isCheckedOut = event.guest_attendance?.check_out_time;

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                <BatikOverlay />
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Link href="/guest-sponsor/events" className="inline-flex items-center text-blue-600 hover:underline mb-6 mt-16">
                        <ArrowLongLeftIcon className="w-5 h-5 mr-2" />
                        Kembali ke Event Saya
                    </Link>

                    {/* Banner */}
                    <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden bg-gray-200">
                        <img
                            src={event.banner_url || event.image_url || "/assets/images/placeholder-event.jpg"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/assets/images/placeholder-event.jpg";
                            }}
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold mt-4">{event.title}</h1>
                    <p className="text-sm text-gray-500">{event.category?.name || "Event"}</p>

                    {/* Location & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start gap-3 p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
                            <MapPinIcon className="w-5 h-5 text-secondary-bg flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold">{event.location || "Lokasi"}</p>
                                {event.address && (
                                    <p className="text-xs text-gray-500">{event.address}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
                            <CalendarDaysIcon className="w-5 h-5 text-secondary-bg flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold">Tanggal & Waktu</p>
                                <p className="text-sm text-gray-600">{formatEventDate()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold font-young">Tentang Event</h2>
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        </div>
                    )}

                    {/* Attendance Status */}
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Status Kehadiran</h2>
                        <div className="flex flex-col gap-3">
                            {isCheckedOut ? (
                                <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center font-medium">
                                    ✓ Anda sudah check-out dari event ini
                                </div>
                            ) : isCheckedIn ? (
                                <>
                                    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center font-medium">
                                        ✓ Anda sudah check-in untuk event ini
                                    </div>
                                    <button
                                        onClick={handleCheckOut}
                                        disabled={checkingIn}
                                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition disabled:opacity-50"
                                    >
                                        {checkingIn ? "Memproses..." : "Check-out"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={checkingIn}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                                >
                                    {checkingIn ? "Memproses..." : "Check-in"}
                                </button>
                            )}
                            <p className="text-xs text-gray-400 text-center mt-2">
                                Pastikan Anda berada di lokasi event saat melakukan check-in/out
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}