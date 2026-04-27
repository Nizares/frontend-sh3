import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";


export default function UpcomingEvents() {
    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <Link href="/events" className="static md:absolute">
                <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
            </Link>
            <div className="flex items-center justify-center w-full">
                <h1 className="text-4xl font-bold ">
                    Borneo Nash Hash 2027
                </h1>
            </div>

            <div className="flex flex-row justify-center gap-x-2">
                <MapPinIcon className="w-8 h-8" />
                <div className="text-lg font-bold">Samarinda, Kalimantan Timur</div>
            </div>
            <Image
                src="/assets/images/poster2027.jpg"
                alt="Logo"
                width={600}
                height={450}
                className="
            h-128 w-full
            flex 
            object-cover rounded-lg
            "
            />

            <div className="grid grid-rows-2 gap-x-16 md:grid-cols-3">
                <div className="col-span-1 flex flex-col md:col-span-2">
                    <h2 className="text-2xl font-bold">
                        Tentang Event
                    </h2>
                    <div className="text-sm">
                        Deep in the heart of Borneo's ancient rainforest, the Samarinda Hash House Harriers invite Hashers from across the globe for the most epic Nash Hash yet. Two days of trails, beer, camaraderie, and pure Hash spirit in the wildest island on earth. Whether you're a seasoned Hasher or a virgin runner — Borneo Nash Hash 2027 promises unforgettable trails through lush jungle, traditional Dayak culture, and legendary On-On celebrations.
                    </div>
                    <Link href="/regismember">
                        <div className="flex justify-center items-center rounded-2xl bg-[#00973D] h-32 font-bold text-2xl text-white hover:bg-green-400 m-10 md:text-5xl active:bg-green-400">
                            Daftar Sekarang
                        </div>
                    </Link>
                </div>
                <div className="bg-[#F6DDB2] rounded-lg gap-x-4 p-4">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold">
                            Early Bid
                        </h3>
                        <div className="text-sm line-through">
                            Rp. 1.400.000
                        </div>
                        <div className="text-lg font-bold">
                            Rp. 900.000/person
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <ol className="list-decimal list-inside p-2">

                            <li>2-Day Hash Trails</li>
                            <li>Welcome Pack & Jersey</li>
                            <li>Welcome Dinner</li>
                            <li>Circle & Down-Down</li>
                            <li>Bisa dicicil</li>
                        </ol>
                        <div className="text-xl font-bold">
                            Event Organizer
                        </div>
                        <div className="text-lg font-semibold">
                            Samarinda Hash House Harriers
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}