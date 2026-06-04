"use client"
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image"

import { useState, useEffect } from "react";
import StructureProfileCard from "@/src/components/StructureProfileCard";

const dataOfficial = [
    { name: "Anton Suprato S.T", images: "/assets/images/contohfotopejabat.jpeg", position: "Ketua", periode: "2026/2027" },
    { name: "Indri Nurfadillah S.Kep", images: "/assets/images/contohfotopejabat.jpeg", position: "Wakil Ketua", periode: "2026/2027" },
    { name: "Fazri Ubaidillah S.Hut", images: "/assets/images/contohfotopejabat.jpeg", position: "Seketaris", periode: "2026/2027" },
    { name: "Prof. Dr. Nurul Huda S.E, M.E", images: "/assets/images/contohfotopejabat.jpeg", position: "Bendahara", periode: "2026/2027" },
]
export default function About() {

    const [structure, setStrucure] = useState([]);
    const [loading, setLoading] = useState(true);

    //   useEffect(() => {
    //     dataOfficialService
    //       .getAll()
    //       .then((res) => {
    //         const data = res.data.data ?? res.data ?? [];
    //         setEvents(Array.isArray(data) ? data : []);
    //       })
    //       .catch((err) => console.error(err))
    //       .finally(() => setLoading(false));
    //   }, []);



    useEffect(() => {
        const data = dataOfficial;
        setStrucure(Array.isArray(data) ? data : []);
    }, [])

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


            <RevealSection direction="up">
                <div className="max-w-306 mx-auto items-center">
                    <div className="font-bold text-neutral-normal text-4xl font-young md:p-4">
                        Struktur
                    </div>
                    <div className="flex flex-row flex-wrap justify-center m-8">
                        {structure.filter(item => item.position === "Ketua").map((item, i) => (
                            <RevealSection key={i} direction="up" delay={i * 100}>
                                <StructureProfileCard
                                    key={i}
                                    images={item.images}
                                    name={item.name}
                                    periode={item.periode}
                                    position={item.position}
                                />
                            </RevealSection>
                        ))}
                    </div>

                    {/* Sisanya - berjajar di bawah */}
                    <div className="flex flex-row flex-wrap justify-center gap-4">
                        {structure.filter(item => item.position !== "Ketua").map((item, i) => (
                            <RevealSection key={i} direction="up" delay={i * 100}>
                                <StructureProfileCard
                                    key={i}
                                    images={item.images}
                                    name={item.name}
                                    periode={item.periode}
                                    position={item.position}
                                />
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </RevealSection>

            <RevealSection direction="up">
                <div className="flex flex-col max-w-306 mx-auto gap-4">
                    <div className="font-bold text-neutral-normal text-4xl font-young md:p-4">
                        Sejarah
                    </div>
                    <div className="indent-32 text-justify">
                        Samarinda Hash House Harriers (SH3) merupakan salah satu komunitas olahraga non-prestasi tertua dan paling legendaris di Samarinda yang diperkirakan telah berdiri sejak era 1980-an.
                        Kehadiran komunitas ini tidak lepas dari sejarah global Hash House Harriers yang pertama kali lahir di Kuala Lumpur, Malaysia, pada tahun 1938. Ketika industri minyak, gas, dan perkayuan
                        berkembang pesat di Kalimantan Timur beberapa dekade lalu, para ekspatriat asing yang bekerja di Samarinda membawa tradisi ini dan berkolaborasi dengan tokoh masyarakat lokal untuk membentuk
                        SH3 sebagai wadah melepas penat sekaligus menjaga kebugaran.
                    </div>

                    <div className="indent-32 text-justify">
                        Selama lebih dari tiga puluh tahun berdiri, SH3 Samarinda berhasil mempertahankan eksistensinya secara konsisten lintas generasi. Keunikan dari komunitas ini terletak pada tradisi lari atau jalan santai lintas
                        alam (trail running/hiking) yang dilakukan secara berkala. Dalam setiap agendanya, mereka menggunakan sistem Paper Chase, di mana para peserta harus melintasi perbukitan, melompati parit, hingga menembus kawasan
                        hutan di pinggiran Samarinda dengan mengikuti petunjuk remahan kertas atau kapur yang telah disebar sebelumnya.
                    </div>

                    <div className="indent-32 text-justify">
                        Salah satu kunci utama mengapa SH3 bisa bertahan sangat lama adalah sifatnya yang sangat inklusif dan kekeluargaan. Di dalam komunitas ini, seluruh sekat sosial, jabatan, dan latar belakang profesi dilepaskan;
                        semua anggota melebur menjadi satu dengan julukan Hashers. Hubungan yang cair ini membuat agenda olahraga selalu diwarnai dengan kegembiraan, senda gurau, dan sesi bersosialisasi yang hangat setelah lelah menyusuri jalur lari.
                    </div>

                    <div className="indent-32 text-justify">
                        Memasuki era modern saat ini, SH3 Samarinda tidak lantas meredup di tengah bermunculannya klub lari baru. Mereka justru terus beradaptasi dengan merangkul generasi muda dan aktif berkolaborasi dalam berbagai event sport tourism
                        di Kalimantan Timur. Melalui konsistensinya yang luar biasa, SH3 kini telah bertransformasi dari sekadar klub hobi menjadi sebuah institusi sosial legendaris yang terus melestarikan semangat kebersamaan, kesehatan, dan kecintaan
                        terhadap alam Samarinda.
                    </div>
                </div>
            </RevealSection>

        </Container>
    );
}