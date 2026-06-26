"use client"
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image"
import StructureProfileCard from "@/src/components/StructureProfileCard";
import BatikOverlay from "@/src/components/BatikOverlay";

const pimpinan = [
    { name: "Minardi Soetomo", position: "Hash Master (Ketua Umum)", images: "/assets/images/contohfotopejabat.png", periode: "2024-2027" },
    { name: "Haryanto Widjojo", position: "Vice Master (Wakil Ketua I)", images: "/assets/images/contohfotopejabat.png", periode: "2024-2027" },
    { name: "Veronika", position: "Joint Master I (Wakil Ketua II)", images: "/assets/images/contohfotopejabat.png", periode: "2024-2027" },
    { name: "Handra Suryadinata", position: "Joint Master II (Wakil Ketua III)", images: "/assets/images/contohfotopejabat.png", periode: "2024-2027" },
    { name: "Cohan Luchas", position: "Hash Secretary (Wakil Ketua IV)", images: "/assets/images/contohfotopejabat.png", periode: "2024-2027" },
]

export default function About() {
    return (
        <Container className="flex flex-col">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
                <BatikOverlay />

                {/* Header */}
                <div className="flex flex-col flex-1 items-center justify-center text-primary-dark-active p-8 mt-16">
                    <h1 className="text-5xl font-bold font-young">About</h1>
                </div>

                {/* Logo & Deskripsi */}
                <RevealSection direction="up">
                    <div className="flex flex-col align-middle md:flex-row max-w-306 mx-auto mb-16 px-4 md:px-0">
                        <div className="w-full md:w-1/2 flex items-center justify-center">
                            <Image
                                src="/assets/images/sh3logo.png"
                                alt="Logo"
                                width={250}
                                height={250}
                                className="w-40 h-40 md:w-64 md:h-64 object-cover rounded-lg"
                            />
                        </div>
                        <div className="w-full p-auto md:w-1/2 flex flex-col gap-4">
                            <p className="text-4xl font-bold font-young text-primary-dark-active ">A Drinking Club With a Running Problem</p>
                            <h2 className="text-3xl font-bold font-young text-primary-dark-active ">Samarinda <span className="text-primary-text">Hash</span> House Harriers</h2>
                            <p className="text-neutral-text leading-relaxed font-medium">
                                Samarinda Hash House Harriers (SH3) adalah komunitas lari sosial yang berdiri di Samarinda, Kalimantan Timur. Kami mengadakan lari mingguan di berbagai sudut kota dan alam Kalimantan, dilanjutkan dengan sesi down-down yang penuh keceriaan.
                            </p>
                            <p className="text-neutral-text leading-relaxed font-medium">
                                Dengan 4.200+ member terdaftar dan rata-rata 250 pelari aktif setiap minggunya, SH3 adalah salah satu Hash chapter terbesar di Kalimantan. Terbuka untuk semua kalangan — On On!
                            </p>
                        </div>
                    </div>
                </RevealSection>

                {/* Highlight Cards */}
                <RevealSection direction="up">
                    <div className="flex flex-col gap-4 max-w-306 mx-auto px-4 md:px-0">
                        <div className="flex flex-col md:flex-row w-full justify-center gap-4">
                            <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-8">
                                <div className="font-bold font-young text-2xl">Weekly Runs</div>
                                <div className="text-xl">Setiap Senin & Sabtu, lokasi berbeda setiap minggu</div>
                            </div>
                            <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-8">
                                <div className="font-bold font-young text-2xl">Down Down</div>
                                <div className="text-xl">Tradisi Hash yang meriah setelah setiap lari</div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row  w-full justify-center gap-4">
                            <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-8">
                                <div className="font-bold font-young text-2xl">Alam Borneo</div>
                                <div className="text-xl">Trail di hutan, sungai, dan bukit Kalimantan</div>
                            </div>
                            <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-8">
                                <div className="font-bold font-young text-2xl">Komunitas</div>
                                <div className="text-xl">Inklusif, ramah, dan penuh tawa</div>
                            </div>
                        </div>
                    </div>
                </RevealSection>

                {/* Sejarah */}
                <RevealSection direction="up">
                    <div className="flex flex-col max-w-306 mx-auto gap-4 p-8">
                        <div className="font-bold text-4xl font-young md:p-4 text-primary-dark-active">Sejarah</div>
                        <div className="indent-32 text-justify">
                            Samarinda Hash House Harriers (SH3) merupakan salah satu komunitas olahraga non-prestasi tertua dan paling legendaris di Samarinda yang diperkirakan telah berdiri sejak era 1980-an.
                            Kehadiran komunitas ini tidak lepas dari sejarah global Hash House Harriers yang pertama kali lahir di Kuala Lumpur, Malaysia, pada tahun 1938. Ketika industri minyak, gas, dan perkayuan
                            berkembang pesat di Kalimantan Timur beberapa dekade lalu, para ekspatriat asing yang bekerja di Samarinda membawa tradisi ini dan berkolaborasi dengan tokoh masyarakat lokal untuk membentuk
                            SH3 sebagai wadah melepas penat sekaligus menjaga kebugaran.
                        </div>
                        <div className="indent-32 text-justify">
                            Selama lebih dari tiga puluh tahun berdiri, SH3 Samarinda berhasil mempertahankan eksistensinya secara konsisten lintas generasi. Keunikan dari komunitas ini terletak pada tradisi lari atau jalan santai lintas
                            alam (trail running/hiking) yang dilakukan secara berkala.
                        </div>
                        <div className="indent-32 text-justify">
                            Salah satu kunci utama mengapa SH3 bisa bertahan sangat lama adalah sifatnya yang sangat inklusif dan kekeluargaan. Di dalam komunitas ini, seluruh sekat sosial, jabatan, dan latar belakang profesi dilepaskan;
                            semua anggota melebur menjadi satu dengan julukan Hashers.
                        </div>
                        <div className="indent-32 text-justify">
                            Memasuki era modern saat ini, SH3 Samarinda tidak lantas meredup di tengah bermunculannya klub lari baru. Mereka justru terus beradaptasi dengan merangkul generasi muda dan aktif berkolaborasi dalam berbagai event sport tourism
                            di Kalimantan Timur.
                        </div>
                    </div>
                </RevealSection>

                {/* ====== STRUKTUR ORGANISASI - PIMPINAN SAJA ====== */}
                <RevealSection direction="up">
                    <div className="p-8">
                        <div className="flex flex-col max-w-306 mx-auto w-full gap-8">
                            <div className="font-bold text-4xl font-young md:p-4 text-primary-dark-active">
                                Struktur Organisasi
                            </div>

                            {/* Hash Master - sendiri di tengah atas */}
                            <div className="flex justify-center">
                                <StructureProfileCard
                                    images={pimpinan[0].images}
                                    name={pimpinan[0].name}
                                    position={pimpinan[0].position}
                                />
                            </div>

                            {/* Vice Master */}
                            <div className="flex justify-center">
                                <StructureProfileCard
                                    images={pimpinan[1].images}
                                    name={pimpinan[1].name}
                                    position={pimpinan[1].position}
                                />
                            </div>

                            {/* Joint Master I, Joint Master II, Hash Secretary - berjajar */}
                            <div className="flex flex-wrap justify-center gap-6">
                                {pimpinan.slice(2).map((item, i) => (
                                    <StructureProfileCard
                                        key={i}
                                        images={item.images}
                                        name={item.name}
                                        position={item.position}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </RevealSection>


                <RevealSection direction="up">
                    <div className="w-full">
                        <TotalStatistic />
                    </div>
                </RevealSection>
            </div>
        </Container>
    );
}