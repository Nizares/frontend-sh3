"use client";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image";
import StructureProfileCard from "@/src/components/StructureProfileCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useState, useEffect } from "react";
import { organisationService } from "@/src/services/organisationService";

export default function About() {
  const [tree, setTree] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil available years
    organisationService
      .getYears()
      .then((res) => setYears(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    organisationService
      .getTree(selectedYear)
      .then((res) => {
        console.log("Tree response:", res.data); // ← tambah ini
        console.log("Tree data:", res.data.data.tree); // ← tambah ini
        setTree(res.data.data.tree);
      })
      .catch((err) => console.error("Error:", err)) // ← tambah ini
      .finally(() => setLoading(false));
  }, [selectedYear]);

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
              <p className="text-4xl font-bold font-young text-primary-dark-active">
                A Drinking Club With a Running Problem
              </p>
              <h2 className="text-3xl font-bold font-young text-primary-dark-active">
                Samarinda <span className="text-primary-text">Hash</span> House
                Harriers
              </h2>
              <p className="text-neutral-text leading-relaxed font-medium">
                Samarinda Hash House Harriers (SH3) adalah komunitas lari sosial
                yang berdiri di Samarinda, Kalimantan Timur. Kami mengadakan
                lari mingguan di berbagai sudut kota dan alam Kalimantan,
                dilanjutkan dengan sesi down-down yang penuh keceriaan.
              </p>
              <p className="text-neutral-text leading-relaxed font-medium">
                Dengan 4.200+ member terdaftar dan rata-rata 250 pelari aktif
                setiap minggunya, SH3 adalah salah satu Hash chapter terbesar di
                Kalimantan. Terbuka untuk semua kalangan — On On!
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
                <div className="text-xl">
                  Setiap Senin & Sabtu, lokasi berbeda setiap minggu
                </div>
              </div>
              <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-8">
                <div className="font-bold font-young text-2xl">Down Down</div>
                <div className="text-xl">
                  Tradisi Hash yang meriah setelah setiap lari
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-center gap-4">
              <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-8">
                <div className="font-bold font-young text-2xl">Alam Borneo</div>
                <div className="text-xl">
                  Trail di hutan, sungai, dan bukit Kalimantan
                </div>
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
            <div className="font-bold text-4xl font-young md:p-4 text-primary-dark-active">
              Sejarah
            </div>
            <div className="indent-32 text-justify">
              Samarinda Hash House Harriers (SH3) merupakan salah satu komunitas
              olahraga non-prestasi tertua dan paling legendaris di Samarinda
              yang diperkirakan telah berdiri sejak era 1980-an.
            </div>
            <div className="indent-32 text-justify">
              Selama lebih dari tiga puluh tahun berdiri, SH3 Samarinda berhasil
              mempertahankan eksistensinya secara konsisten lintas generasi.
            </div>
            <div className="indent-32 text-justify">
              Salah satu kunci utama mengapa SH3 bisa bertahan sangat lama
              adalah sifatnya yang sangat inklusif dan kekeluargaan.
            </div>
            <div className="indent-32 text-justify">
              Memasuki era modern saat ini, SH3 Samarinda tidak lantas meredup
              di tengah bermunculannya klub lari baru.
            </div>
          </div>
        </RevealSection>

        {/* Struktur Organisasi dari API */}
        <RevealSection direction="up">
          <div className="p-8">
            <div className="flex flex-col max-w-306 mx-auto w-full gap-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="font-bold text-4xl font-young md:p-4 text-primary-dark-active">
                  Struktur Organisasi
                </div>

                {/* Filter Tahun */}
                {years.length > 0 && (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border-2 border-neutral-normal bg-primary-light px-4 py-2 font-young text-lg"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center p-8 text-xl">
                  Loading...
                </div>
              ) : tree.length === 0 ? (
                <div className="flex justify-center p-8 text-xl text-neutral-dark">
                  Tidak ada data struktur organisasi.
                </div>
              ) : (
                // Render per level
                tree.map((node, i) => (
                  <RevealSection key={i} direction="up">
                    <div className="flex flex-col gap-4">
                      {/* Nama posisi level ini */}
                      <div className="flex flex-wrap justify-center gap-6">
                        {/* Card posisi utama */}
                        {node.holders?.map((holder, j) => (
                          <StructureProfileCard
                            key={j}
                            images={
                              holder.photo_url ??
                              "/assets/images/contohfotopejabat.png"
                            }
                            name={holder.name}
                            position={node.position_name}
                          />
                        ))}
                        {/* Kalau tidak ada holder, tampilkan posisi kosong */}
                        {node.holders?.length === 0 && (
                          <StructureProfileCard
                            images="/assets/images/contohfotopejabat.png"
                            name="Kosong"
                            position={node.position_name}
                          />
                        )}
                      </div>

                      {/* Children (sub-posisi) */}
                      {node.children_list?.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6 mt-4">
                          {node.children_list.map((child, k) =>
                            child.holders?.map((holder, l) => (
                              <StructureProfileCard
                                key={`${k}-${l}`}
                                images={
                                  holder.photo_url ??
                                  "/assets/images/contohfotopejabat.png"
                                }
                                name={holder.name}
                                position={child.position_name}
                              />
                            )),
                          )}
                        </div>
                      )}
                    </div>
                  </RevealSection>
                ))
              )}
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
