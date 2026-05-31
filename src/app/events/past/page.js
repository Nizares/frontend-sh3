"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { TagIcon } from "@heroicons/react/24/solid";
import { concateDate } from "@/src/lib/utils";
import { eventService } from "@/src/services/eventService";
import { RevealSection } from "@/src/components/RevealSection";

export default function PastEvents({ }) {
    const [event, setEvent] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const eventId = searchParams.get("id") ?? 1;
        eventService.getById(eventId)
            .then(res => setEvent(res.data.data))
            .catch(err => console.error(err));
    }, []);

    console.log(event);

    if (!event) return <div className="flex justify-center p-16 text-2xl">Loading...</div>;

    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <div className="max-w-306 mx-auto">
                <RevealSection direction="up">

                    <div className="flex flex-col gap-y-4 mt-8">
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
                    </div>
                </RevealSection>

                <RevealSection direction="up" delay="100">
                    <Image
                        src={event.image_url}
                        alt={event.title}
                        width={600}
                        height={450}
                        className="h-128 w-full flex object-cover mt-4"
                    />
                </RevealSection>

                <RevealSection direction="up" delay="100">
                    <div className="flex flex-col gap-x-16 mt-4">
                        <h2 className="text-2xl font-bold py-4 font-young">Tentang Event</h2>
                        <div className="text-sm">{event.description}</div>
                    </div>
                </RevealSection>
            </div>


            <RevealSection direction="up" delay="100">
                <div className="flex flex-col w-full justify-center items-center gap-8 md:gap-32 md:flex-row bg-secondary-bg p-8 text-white font-young">
                    <div className="flex flex-row items-center justify-center gap-8">
                        <UserGroupIcon className="w-16 h-16 md:w-32 md:h-32" />
                        <div className="flex flex-col">
                            <div className="font-bold text-4xl">Joined</div>
                            <div className="font-semibold text-3xl">{event.registered_count} Members</div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-8">
                        <TagIcon className="w-16 h-16 md:w-32 md:h-32" />
                        <div className="flex flex-col">
                            <div className="font-bold text-4xl">Category</div>
                            <div className="font-semibold text-3xl">{event.category?.name}</div>
                        </div>
                    </div>
                </div>
            </RevealSection>
        </Container>
    );
}