"use client"
import { useState, useEffect } from "react";

import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { eventService } from "@/src/services/eventService";
import InputType from "@/src/components/Inputs";
import Pagination from "@/src/components/Pagination";

export default function EventMembers() {
    const [participants, setParticipants] = useState([]);
    const [event, setEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [eventId, setEventId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLargeEvent, setIsLargeEvent] = useState(false);

    // 🔥 Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id") ?? 1;
        setEventId(id);

        Promise.all([
            eventService.getById(id),
            eventService.getParticipants(id)
        ])
        .then(([eventRes, participantsRes]) => {
            const eventData = eventRes.data.data;
            setEvent(eventData);
            setParticipants(participantsRes.data.data || []);
            
            // 🔥 Cek acara besar
            const isMajor = eventData?.category?.name?.toLowerCase()?.includes("major") || 
                           eventData?.category?.slug === "major-events" ||
                           eventData?.category?.id === 3;
            setIsLargeEvent(isMajor);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
        })
        .finally(() => setLoading(false));

    }, []);

    const formatDate = (iso) => {
        if (!iso) return "-";
        return new Date(iso).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
        });
    };

    // 🔥 Filter berdasarkan pencarian
    const filtered = participants.filter(p => {
        const name = p.participant?.name || "";
        const email = p.participant?.email || "";
        const hashId = p.participant?.hash_id || "";
        const query = search.toLowerCase();
        return name.toLowerCase().includes(query) || 
               email.toLowerCase().includes(query) ||
               hashId.toLowerCase().includes(query);
    });

    // 🔥 Pagination logic
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filtered.slice(startIndex, endIndex);

    // 🔥 Reset ke halaman 1 saat search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // 🔥 Page navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPaymentBadge = (status) => {
        if (status === "confirmed" || status === "paid") {
            return "bg-green-100 text-green-700";
        } else if (status === "pending") {
            return "bg-yellow-100 text-yellow-700";
        } else if (status === "free") {
            return "bg-blue-100 text-blue-700";
        }
        return "bg-gray-100 text-gray-700";
    };

    const getPaymentLabel = (status) => {
        if (status === "confirmed" || status === "paid") return "Lunas";
        if (status === "pending") return "Menunggu";
        if (status === "free") return "Gratis";
        return status || "-";
    };

    // 🔥 Generate Hash Club (placeholder)
    const generateHashClub = (participant, index) => {
        if (participant.hash_club) {
            return participant.hash_club;
        }
        
        const baseId = participant.hash_id || `P${String(index + 1).padStart(4, '0')}`;
        const clubCode = baseId.replace('NM-', '');
        return `SH3-${clubCode}`;
    };

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-lg">Memuat peserta...</p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
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
                <div className="max-w-306 mx-auto min-h-screen z-1 relative px-4 md:px-0 py-8">
                    {/* Header */}
                    <div className="flex flex-col gap-y-4">
                        <Link href={`/events/upcoming?id=${eventId}`} className="static md:absolute">
                            <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                        </Link>

                        <div className="flex flex-col items-center gap-y-1 text-center">
                            <h1 className="text-3xl font-bold mt-24">{event?.title || "Event"}</h1>
                            <div className="flex items-center gap-x-2 text-gray-500">
                                <CalendarDaysIcon className="w-5 h-5" />
                                <span className="text-sm">{formatDate(event?.start_date)}</span>
                            </div>
                        </div>

                        {/* Stats badge */}
                        <div className="flex justify-center">
                            <div className="flex items-center gap-x-2 bg-secondary-bg text-white font-semibold px-4 py-2 text-sm rounded-md">
                                <UserGroupIcon className="w-5 h-5" />
                                {totalItems} Peserta Terdaftar
                            </div>
                        </div>

                        <div className="flex flex-col justify-center w-full gap-4">
                            <InputType
                                label="Cari Orang atau Teman anda!"
                                type="text"
                                placeholder="Cari nama, hash ID, atau email peserta..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex flex-col gap-2"
                            />
                        </div>
                    </div>

                    {/* 🔥 TABEL PESERTA */}
                    {currentItems.length === 0 ? (
                        <div className="text-center text-neutral-dark py-12">
                            {search ? "Tidak ada peserta yang cocok dengan pencarian." : "Belum ada peserta yang mendaftar."}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto mt-8 pb-4">
                                <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
                                    <thead>
                                        <tr className="bg-primary-light border-b-2 border-neutral-normal">
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">No</th>
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">Hash ID</th>
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">Nama</th>
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">Member</th>
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">Jersey Size</th>
                                            {isLargeEvent && (
                                                <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">
                                                    Hash Club
                                                    <span className="ml-1 text-xs font-normal text-gray-400">(placeholder)</span>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item, index) => {
                                            const participant = item.participant || {};
                                            const isMember = participant.membership_type && participant.membership_type !== "none";
                                            const globalIndex = startIndex + index + 1;
                                            const hashClub = generateHashClub(participant, index);
                                            
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-neutral-light hover:bg-primary-light/30 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-sm text-neutral-dark">
                                                        {globalIndex}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-mono font-bold text-secondary-bg">
                                                        {participant.hash_id || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                        <div className="flex items-center gap-2">
                                                            {participant.avatar ? (
                                                                <img
                                                                    src={participant.avatar}
                                                                    alt={participant.name}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-secondary-bg flex items-center justify-center text-white text-xs font-bold">
                                                                    {participant.name?.charAt(0).toUpperCase() || "?"}
                                                                </div>
                                                            )}
                                                            <span>{participant.name || "Unknown"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPaymentBadge(item.payment_status)}`}>
                                                            {getPaymentLabel(item.payment_status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {isMember ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                                                Member
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                                                                Non Member
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-mono">
                                                        {participant.jersey_size || "-"}
                                                    </td>
                                                    {isLargeEvent && (
                                                        <td className="px-4 py-3 text-sm font-mono">
                                                            <span className="bg-gray-100 px-2 py-1 rounded-md text-neutral-dark border border-gray-200">
                                                                {hashClub}
                                                            </span>
                                                            <span className="ml-1 text-[10px] text-gray-400">*</span>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* 🔥 Info placeholder */}
                            {isLargeEvent && (
                                <div className="text-xs text-gray-400 text-center mt-1">
                                    * Hash Club bersifat placeholder sementara, menunggu data dari backend
                                </div>
                            )}

                            {/* 🔥 PAGINATION - PAKAI KOMPONEN */}
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />

                            {/* 🔥 Info halaman */}
                            <div className="text-center text-sm text-neutral-dark mt-2">
                                Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} peserta
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}