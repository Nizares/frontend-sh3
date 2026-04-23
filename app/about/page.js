import Container from "@/components/Container"
import { FireIcon } from "@heroicons/react/24/outline"
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Image from "next/image"
export default function About() {
    return (
    <Container className="flex flex-col gap-y-16">
        <h1 className="font-semibold text-5xl relative text-center">About</h1>
        <div className="flex flex-col align-middle md:flex-row">
            <div className="w-full flex items-center justify-center">
            <Image
                src="/assets/images/sh3logo.png"
                alt="Logo"
                width={250}
                height={250}
                className="
                w-40 h-40
                md:w-64 md:h-64
                lg:w-64 lg:h-64
                object-cover rounded-lg
                "
            />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                <h2 className="text-3xl font-bold">Samarinda Hash House Harriers</h2>
                <p className="text-gray-800 leading-relaxed font-medium">
                    Samarinda Hash House Harriers (SH3) adalah komunitas lari sosial yang berdiri di Samarinda, Kalimantan Timur. Kami mengadakan lari mingguan di berbagai sudut kota dan alam Kalimantan, dilanjutkan dengan sesi down-down yang penuh keceriaan.
                </p>
                <p className="text-gray-800 leading-relaxed font-medium">
                    Dengan 4.200+ member terdaftar dan rata-rata 250 pelari aktif setiap minggunya, SH3 adalah salah satu Hash chapter terbesar di Kalimantan. Terbuka untuk semua kalangan — On On!
                </p>

            </div>

        </div>
        <div className="flex items-center gap-x-8 text-white bg-[#E29208]">
            <div className="flex flex-row items-center">
                <FireIcon className="w-48 h-48" />
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-4xl">2381</p>
                    <p className="font-semibold text-2xl">Total Runs</p>
                </div>
            </div>
            <div className="flex flex-row items-center ">
                <UserGroupIcon className="w-48 h-48" />
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-4xl">4.200+</p>
                    <p className="font-semibold text-2xl">Total Member Terdaftar</p>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <RocketLaunchIcon className="w-48 h-48" />
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-4xl">2381</p>
                    <p className="font-semibold text-2xl">Active Runner Per Week</p>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <CalendarDaysIcon className="w-48 h-48" />
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-4xl">ON ON</p>
                    <p className="font-semibold text-2xl">Per Week</p>
                </div>
            </div>
        </div>
    </Container>
    );
}