// src/app/guest-sponsor/events/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Container from "@/src/components/Container";
import BatikOverlay from "@/src/components/BatikOverlay";
import { guestSponsorService } from "@/src/services/guestSponsorService";
import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function GuestSponsorEvents() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoggedIn || user?.role !== "guest_sponsor") {
            router.push("/guest-sponsor/login");
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await guestSponsorService.getMyEvents();
                setEvents(response.data?.data || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching guest sponsor events:", err);
                setError(err.response?.data?.message || "Gagal memuat event");
                if (err.response?.status === 401) {
                    router.push("/guest-sponsor/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [isLoggedIn, user, router]);

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                <BatikOverlay />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mt-16 mb-8">
                        <h1 className="text-3xl font-bold font-young">
                            Event Saya
                        </h1>
                        <span className="text-sm text-gray-500">
                            {events.length} event
                        </span>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                            <p>{error}</p>
                        </div>
                    )}

                    {events.length === 0 && !error ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg">
                                Anda belum terdaftar sebagai sponsor untuk event apapun.
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                Hubungi admin untuk informasi lebih lanjut.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/guest-sponsor/events/${event.id}`}
                                    className="block group"
                                >
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                                        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                                            <img
                                                src={event.banner_url || event.image_url || "/assets/images/placeholder-event.jpg"}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = "/assets/images/placeholder-event.jpg";
                                                }}
                                            />
                                            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
                                                event.status === "ongoing" ? "bg-green-500" :
                                                event.status === "publish" ? "bg-blue-500" :
                                                event.status === "completed" ? "bg-purple-500" :
                                                event.status === "cancelled" ? "bg-red-500" :
                                                "bg-gray-500"
                                            }`}>
                                                {event.status === "ongoing" ? "Berlangsung" :
                                                 event.status === "publish" ? "Akan Datang" :
                                                 event.status === "completed" ? "Selesai" :
                                                 event.status === "cancelled" ? "Dibatalkan" :
                                                 event.status}
                                            </span>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                <span>{formatDate(event.start_date)}</span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {event.registered_count || 0} peserta
                                                </span>
                                                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                                                    Lihat Detail →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}