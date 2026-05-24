"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { eventService } from "@/src/services/eventService";

import InputType from "@/src/components/Inputs";

export default function EventMembers() {
    const [data, setData] = useState(null);
    const [search, setSearch] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const eventId = searchParams.get("id") ?? 1;
        eventService.getParticipants(eventId)
            .then(res => setData(res.data.data))
            .catch(err => console.error(err));
    }, []);

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
        });

    const filtered = data?.participants?.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    if (!data) return (
        <div className="flex justify-center p-16 text-2xl">Loading...</div>
    );

    return (
        <Container className="flex flex-col gap-y-6 w-full py-8">
            {/* Header */}
            <div className="flex flex-col gap-y-4">
                <Link href={`/events/upcoming?id=${searchParams.get("id")}`} className="static md:absolute">
                    <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                </Link>

                <div className="flex flex-col items-center gap-y-1 text-center">
                    <h1 className="text-3xl font-bold">{data.event.title}</h1>
                    <div className="flex items-center gap-x-2 text-gray-500">
                        <CalendarDaysIcon className="w-5 h-5" />
                        <span className="text-sm">{formatDate(data.event.start_date)}</span>
                    </div>
                </div>

                {/* Stats badge */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-x-2 bg-[#00973D]/10 text-[#00973D] font-semibold px-4 py-2 rounded-full text-sm">
                        <UserGroupIcon className="w-5 h-5" />
                        {data.total_participants} Peserta Terdaftar
                    </div>
                </div>

                {/* Search */}
                {/* <input
                    type="text"
                    placeholder="Cari nama atau email peserta..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00973D]/40"
                /> */}

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
                <div className="text-center text-gray-400 py-12">Tidak ada peserta ditemukan.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filtered.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-x-3 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {member.photo_url ? (
                                <Image
                                    src={member.photo_url}
                                    alt={member.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#00973D]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#00973D] font-bold text-base">
                                        {member.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-gray-800 truncate">{member.name}</span>
                                <span className="text-xs text-gray-400 truncate">{member.email}</span>
                                <span className="text-xs text-gray-400 capitalize">{member.gender}</span>
                                <span className="text-xs text-gray-300 mt-1">Joined {formatDate(member.joined_at)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}
