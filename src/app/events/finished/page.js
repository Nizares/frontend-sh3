"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/src/components/Container";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, CalendarDaysIcon, UserGroupIcon, TagIcon } from "@heroicons/react/24/solid";
import { concateDate, formatRupiah } from "@/src/lib/utils";
import { eventService } from "@/src/services/eventService";
import { galleryService } from "@/src/services/galleryService";
import { RevealSection } from "@/src/components/RevealSection";
import SponsorSection from "@/src/components/SponsorSection";
import EventGallery from "@/src/components/EventGallery";
import Pagination from "@/src/components/Pagination";

export default function PastEvents() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("id");

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [albums, setAlbums] = useState([]);

    // Pagination untuk gallery
    const [galleryPage, setGalleryPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (!eventId) {
            setError("Event tidak ditemukan");
            setLoading(false);
            return;
        }

        // Fetch event detail
        eventService
            .getById(eventId)
            .then((res) => {
                setEvent(res.data?.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching event:", err);
                setError(err.response?.data?.message || "Gagal memuat event");
            })
            .finally(() => setLoading(false));

        // Fetch albums untuk link Google Drive
        galleryService
            .getAlbums()
            .then((res) => {
                const allAlbums = res.data?.data || [];
                const eventAlbums = allAlbums.filter(
                    (album) => album.event_id === parseInt(eventId)
                );
                setAlbums(eventAlbums);
            })
            .catch(() => {
                // Silent fail
            });
    }, [eventId]);

    // Gallery pagination
    const handleGalleryPageChange = (page) => {
        setGalleryPage(page);
    };

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
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
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-center">
                            <p className="text-xl text-red-600">{error || "Event tidak ditemukan"}</p>
                            <Link href="/events" className="text-blue-600 hover:underline mt-4 inline-block">
                                ← Kembali ke Event
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    const bannerImage = event.banner_url || event.image_url || "/assets/images/placeholder-event.jpg";
    const detailImage = event.image_url || event.banner_url || "/assets/images/placeholder-event.jpg";
    const hasDetailImage = detailImage && detailImage !== "/assets/images/placeholder-event.jpg";

    // Format tanggal
    const formatEventDate = () => {
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

    // Gallery data
    const galleries = event.galleries || [];
    const totalGalleryPages = Math.ceil(galleries.length / itemsPerPage);
    const startIndex = (galleryPage - 1) * itemsPerPage;
    const paginatedGalleries = galleries.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover min-h-screen">
                {/* Batik Decoration */}
                <div
                    className="absolute top-0 left-0 h-full w-28 bg-repeat-y bg-left mask-r-from-5%"
                    style={{
                        backgroundImage: `url('/assets/images/batik4.svg')`,
                        backgroundSize: "112px",
                    }}
                />
                <div
                    className="absolute top-0 right-0 h-full w-28 bg-repeat-y bg-left -scale-x-100 mask-r-from-5%"
                    style={{
                        backgroundImage: `url('/assets/images/batik4.svg')`,
                        backgroundSize: "112px",
                    }}
                />

                <div className="max-w-306 mx-auto px-4 md:px-0 relative z-1">
                    {/* Back Button & Title */}
                    <div className="mt-24">
                        <Link href="/events" className="static md:absolute">
                            <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                        </Link>
                        <div className="flex items-center justify-center w-full">
                            <h1 className="text-4xl font-bold">{event.title}</h1>
                        </div>
                    </div>

                    {/* Location & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Location */}
                        <div className="flex flex-col p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
                            <div className="flex flex-row items-start gap-x-3">
                                <MapPinIcon className="w-6 h-6 text-secondary-bg flex-shrink-0 mt-0.5" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-semibold">{event.location || "Lokasi"}</span>
                                    {event.address && (
                                        <span className="text-xs text-neutral-dark line-clamp-2">
                                            {event.address}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="flex flex-col p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
                            <div className="flex flex-row items-start gap-x-3">
                                <CalendarDaysIcon className="w-6 h-6 text-secondary-bg flex-shrink-0 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">Tanggal & Waktu</span>
                                    <span className="text-sm text-neutral-dark">
                                        {formatEventDate()}
                                    </span>
                                </div>
                            </div>
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

                    {/* Category */}
                    <div className="mt-4">
                        <p className="text-sm text-neutral-dark">{event.category?.name || "Event"}</p>
                    </div>

                    {/* Description */}
                    <RevealSection direction="up" delay="100">
                        <div className="flex flex-col gap-x-16 my-4">
                            <h2 className="text-2xl font-bold py-4 font-young">Tentang Event</h2>
                            <div className="text-sm text-justify">{event.description}</div>
                        </div>
                    </RevealSection>

                    {/* Stats */}
                    <RevealSection direction="up" delay="100">
                        <div className="flex flex-col w-full justify-center items-center gap-8 md:gap-32 md:flex-row bg-emerald-600 p-8 text-white font-young rounded-lg my-4">
                            <div className="flex flex-row items-center justify-center gap-8">
                                <UserGroupIcon className="w-16 h-16 md:w-32 md:h-32" />
                                <div className="flex flex-col">
                                    <div className="font-bold text-4xl">Joined</div>
                                    <div className="font-semibold text-3xl">{event.registered_count || 0} Members</div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-8">
                                <TagIcon className="w-16 h-16 md:w-32 md:h-32" />
                                <div className="flex flex-col">
                                    <div className="font-bold text-4xl">Category</div>
                                    <div className="font-semibold text-3xl">{event.category?.name || "-"}</div>
                                </div>
                            </div>
                        </div>
                    </RevealSection>

                    {/* Gallery Section */}
                    {galleries.length > 0 && (
                        <RevealSection direction="up" delay="100">
                            <div className="my-6">
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
                        </RevealSection>
                    )}

                    {/* 🔥 Google Drive Album Link */}
                    {albums.length > 0 && (
                        <RevealSection direction="up" delay="100">
                            <div className="my-6 bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold font-young mb-4">📁 Album Lengkap</h2>
                                <div className="flex flex-wrap gap-4">
                                    {albums.map((album) => (
                                        <div key={album.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                                            <span className="font-medium">{album.title}</span>
                                            {album.gdrive_folder_url && (
                                                <a
                                                    href={album.gdrive_folder_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    Buka di Google Drive →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealSection>
                    )}

                    {/* Sponsors */}
                    {event.sponsors && event.sponsors.length > 0 && (
                        <RevealSection direction="up" delay="100">
                            <div className="w-full py-4">
                                <SponsorSection sponsors={event.sponsors} />
                            </div>
                        </RevealSection>
                    )}
                </div>
            </div>
        </Container>
    );
}