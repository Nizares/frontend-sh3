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
import { RevealSection } from "@/src/components/RevealSection";

export default function UpcomingEvents({ }) {
    const [event, setEvent] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const eventId = searchParams.get("id") ?? 1;
        eventService.getById(eventId)
            .then(res => setEvent(res.data.data))
            .catch(err => console.error(err));
    }, []);

    const formatRupiah = (angka) => new Intl.NumberFormat("id-ID").format(angka);

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

            <RevealSection direction="up" delay="100">
                <Image
                    src={event.image_url}
                    alt={event.title}
                    width={600}
                    height={450}
                    className="h-128 w-full flex object-cover rounded-lg"
                />
            </RevealSection>

            <RevealSection direction="up" delay="100">
                <div className="grid grid-rows-2 gap-x-16 md:grid-cols-3">
                    <div className="col-span-1 flex flex-col md:col-span-2">
                        <h2 className="text-2xl font-bold">Tentang Event</h2>
                        <div className="text-sm">{event.description}</div>
                        <Link href={`/events/register?id=${event.id}`}>
                            <div className="flex justify-center items-center rounded-2xl bg-[#00973D] h-32 font-bold text-2xl text-white hover:bg-green-400 m-10 md:text-5xl active:bg-green-400">
                                Daftar Sekarang
                            </div>
                        </Link>
                    </div>
                    <div className="bg-card-bg rounded-lg gap-x-4 p-4">
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
                </div>
            </RevealSection>
        </Container>
    );
}