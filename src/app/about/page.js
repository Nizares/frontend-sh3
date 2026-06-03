"use client"
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image"
export default function About() {
    return (
        <Container className="flex flex-col gap-y-16">
            <div className="flex flex-col flex-1 items-center justify-center p-8">
                <h1 className="text-neutral-normal text-5xl font-bold font-young">About</h1>
            </div>
            <RevealSection direction="up">
                <div className="flex flex-col align-middle md:flex-row max-w-306 mx-auto mb-16">
                    <div className="w-full md:w-1/2 flex items-center justify-center">
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
                    <div className="w-full p-auto md:w-1/2 flex flex-col gap-4">
                        <p className="text-4xl font-bold font-young text-neutral-normal">A Drinking Club With a Running Problem</p>
                        <h2 className="text-3xl font-bold font-young text-neutral-normal">Samarinda <span className="text-secondary-text">Hash</span> House Harriers</h2>

                        <p className="text-neutral-text leading-relaxed font-medium">
                            Samarinda Hash House Harriers (SH3) adalah komunitas lari sosial yang berdiri di Samarinda, Kalimantan Timur. Kami mengadakan lari mingguan di berbagai sudut kota dan alam Kalimantan, dilanjutkan dengan sesi down-down yang penuh keceriaan.
                        </p>
                        <p className="text-neutral-text leading-relaxed font-medium">
                            Dengan 4.200+ member terdaftar dan rata-rata 250 pelari aktif setiap minggunya, SH3 adalah salah satu Hash chapter terbesar di Kalimantan. Terbuka untuk semua kalangan — On On!
                        </p>

                    </div>
                </div>
            </RevealSection>
            <RevealSection direction="up">
                <div className="flex flex-col text-white gap-4">
                    <div className="flex flex-row w-full justify-center gap-4">
                        <div className="flex flex-col w-lg bg-secondary-dark p-8">
                            <div className="font-bold font-young text-2xl">
                                Weekly Runs

                            </div>
                            <div className="text-xl">
                                Setiap Senin & Sabtu, lokasi berbeda setiap minggu
                            </div>
                        </div>
                        <div className="flex flex-col w-lg bg-secondary-dark p-8">
                            <div className="font-bold font-young text-2xl">
                                Down Down

                            </div>
                            <div className="text-xl">
                                Tradisi Hash yang meriah setelah setiap lari
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full justify-center gap-4">
                        <div className="flex flex-col w-lg bg-secondary-dark p-8">
                            <div className="font-bold font-young text-2xl">
                                Alam Borneo

                            </div>
                            <div className="text-xl">
                                Trail di hutan, sungai, dan bukit Kalimantan
                            </div>
                        </div>
                        <div className="flex flex-col w-lg bg-secondary-dark p-8">
                            <div className="font-bold font-young text-2xl">
                                Komunitas

                            </div>
                            <div className="text-xl">
                                Inklusif, ramah, dan penuh tawa 
                            </div>
                        </div>
                    </div>
                </div>
            </RevealSection>

            <RevealSection direction="up">
                <TotalStatistic />
            </RevealSection>


        </Container>
    );
}