"use client"
import { useState, useEffect } from "react";

import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { eventService } from "@/src/services/eventService";
import InputType from "@/src/components/Inputs";

export default function EventMembers() {
    const [participants, setParticipants] = useState([]);
    const [event, setEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [eventId, setEventId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id") ?? 1;
        setEventId(id);

        // 🔥 Ambil data event dan participants sekaligus
        Promise.all([
            eventService.getById(id),
            eventService.getParticipants(id)
        ])
        .then(([eventRes, participantsRes]) => {
            setEvent(eventRes.data.data);
            setParticipants(participantsRes.data.data || []);
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

    // 🔥 Filter berdasarkan nama peserta
    const filtered = participants.filter(p => {
        const name = p.participant?.name || "";
        const email = p.participant?.email || "";
        const query = search.toLowerCase();
        return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
    });

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
                <div className="max-w-306 mx-auto h-screen z-1 relative px-4 md:px-0">
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
                                {participants.length} Peserta Terdaftar
                            </div>
                        </div>

                        <div className="flex flex-col justify-center w-full gap-4">
                            <InputType
                                label="Cari Orang atau Teman anda!"
                                type="text"
                                placeholder="Cari nama atau email peserta..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex flex-col gap-2"
                            />
                        </div>
                    </div>

                    {/* Member grid */}
                    {filtered.length === 0 ? (
                        <div className="text-center text-neutral-dark py-12">
                            {search ? "Tidak ada peserta yang cocok dengan pencarian." : "Belum ada peserta yang mendaftar."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-8 pb-8">
                            {filtered.map((item) => {
                                const participant = item.participant || {};
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-x-3 bg-white border-primary-normal border-2 p-3 shadow-sm hover:shadow-md transition-shadow rounded-md"
                                    >
                                        {/* 🔥 Avatar */}
                                        {participant.avatar ? (
                                            <Image
                                                src={participant.avatar}
                                                alt={participant.name || "Participant"}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 object-cover shrink-0 rounded-md"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-secondary-bg flex items-center justify-center shrink-0 rounded-md">
                                                <span className="text-white font-bold text-base">
                                                    {participant.name?.charAt(0).toUpperCase() || "?"}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-neutral-dark truncate">
                                                {participant.name || "Unknown"}
                                            </span>
                                            <span className="text-xs text-neutral-dark truncate">
                                                {participant.email || "-"}
                                            </span>
                                            <span className="text-xs text-neutral-dark-active capitalize">
                                                {participant.gender || "-"}
                                            </span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                                    item.payment_status === "confirmed" || item.payment_status === "paid" 
                                                        ? "bg-green-100 text-green-700" 
                                                        : item.payment_status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {item.payment_status === "confirmed" || item.payment_status === "paid" 
                                                        ? "Lunas" 
                                                        : item.payment_status === "pending"
                                                        ? "Menunggu"
                                                        : item.payment_status || "-"}
                                                </span>
                                                {item.registration_type === "membership" && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                                                        Member
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-neutral-dark mt-0.5">
                                                Joined {formatDate(item.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}