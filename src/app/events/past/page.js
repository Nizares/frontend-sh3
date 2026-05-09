import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { TagIcon } from "@heroicons/react/24/solid";

import { concateDate } from "@/src/lib/utils";

const dummyEvents = [
    {
        id: 5,
        title: "Ketupat Cap Go Meh Run 2026",
        start_date: "2026-03-29",
        end_date: "2026-03-30",
        category: "Long Run",
        img: "/assets/images/ketupat_banner.jpg",
        eventog: "Samarinda Hash House Harriers",
        status: "ended",

        price: 900000,
        slot: 300
    },
]

export default function PastEvents() {
    const event = dummyEvents[0];
    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <Link href="/events" className="static md:absolute">
                <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
            </Link>
            <div className="flex items-center justify-center w-full">
                <h1 className="text-4xl font-bold ">
                    {event.title}
                </h1>
            </div>

            <div className="flex flex-row justify-between gap-x-2">
                <div className="flex flex-row justify-center gap-x-2">
                    <MapPinIcon className="w-8 h-8" />
                    <div className="text-lg font-bold">Samarinda, Kalimantan Timur</div>
                </div>
                <div className="flex flex-row gap-x-2">
                    <div className="text-lg font-bold"> {concateDate(event.start_date, event.end_date)}</div>
                </div>
            </div>
            <Image
                src={event.img}
                alt="Logo"
                width={600}
                height={450}
                className="
            h-128 w-full
            flex 
            object-cover rounded-lg
            "
            />

            <div className="flex flex-col gap-x-16">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">
                        Tentang Event
                    </h2>
                    <div className="text-sm">
                        Deep in the heart of Borneo's ancient rainforest, the Samarinda Hash House Harriers invite Hashers from across the globe for the most epic Nash Hash yet. Two days of trails, beer, camaraderie, and pure Hash spirit in the wildest island on earth. Whether you're a seasoned Hasher or a virgin runner — Borneo Nash Hash 2027 promises unforgettable trails through lush jungle, traditional Dayak culture, and legendary On-On celebrations.
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full justify-center items-center gap-8 md:gap-32 md:flex-row">
                <div className="flex flex-row items-center justify-center gap-8">
                    <UserGroupIcon className="w-16 h-16 md:w-32 md:h-32" />
                    <div className="flex flex-col">
                        <div className="font-bold text-4xl">
                            Joined
                        </div>
                        <div className="font-semibold text-3xl">
                            250 Members
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center gap-8">
                    <TagIcon className="w-16 h-16 md:w-32 md:h-32" />
                    <div className="flex flex-col">
                        <div className="font-bold text-4xl">
                            Category
                        </div>
                        <div className="font-semibold text-3xl">
                            {event.category}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}