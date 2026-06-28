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

  function OrgNode({ node }) {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div className="flex flex-col items-center">
        {/* Card jabatan */}
        <div className="flex flex-wrap justify-center gap-3">
          {node.holders?.length > 0 ? (
            node.holders.map((holder, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-primary-light border-2 border-neutral-normal p-4 min-w-40 max-w-48 text-center"
              >
                <div className="font-bold font-young text-sm text-neutral-normal leading-tight">
                  {node.position_name}
                </div>
                <div className="text-xs text-neutral-dark mt-1 font-medium">
                  {holder.name}
                </div>
                {holder.period_text && (
                  <div className="text-xs text-neutral-dark mt-1 opacity-60">
                    {holder.period_text}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center bg-primary-light border-2 border-neutral-normal p-4 min-w-40 max-w-48 text-center">
              <div className="font-bold font-young text-sm text-neutral-normal">
                {node.position_name}
              </div>
              <div className="text-xs text-neutral-dark mt-1 italic">Kosong</div>
            </div>
          )}
        </div>

        {/* Garis penghubung ke children */}
        {hasChildren && (
          <>
            <div className="w-0.5 h-6 bg-neutral-normal" />
            <div className="flex flex-row items-start gap-4 md:gap-8">
              {node.children.map((child, i) => (
                <div key={i} className="flex flex-col items-center">
                  {/* Garis horizontal */}
                  {node.children.length > 1 && (
                    <div className="w-full h-0.5 bg-neutral-normal" />
                  )}
                  <div className="w-0.5 h-6 bg-neutral-normal" />
                  <OrgNode node={child} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function OrgTree({ nodes }) {
    return (
      <div className="overflow-x-auto pb-8">
        <div className="flex flex-col items-center min-w-max mx-auto">
          {nodes.map((node, i) => (
            <OrgNode key={i} node={node} />
          ))}
        </div>
      </div>
    );
  }

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
        {/* Struktur Organisasi dari API */}
        <RevealSection direction="up">
          <div className="p-8">
            <div className="flex flex-col max-w-306 mx-auto w-full gap-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="font-bold text-4xl font-young md:p-4 text-primary-dark-active">
                  Struktur Organisasi
                </div>
                {years.length > 0 && (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border-2 border-neutral-normal bg-primary-light px-4 py-2 font-young text-lg"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center p-8 text-xl">Loading...</div>
              ) : tree.length === 0 ? (
                <div className="flex justify-center p-8 text-xl text-neutral-dark">
                  Tidak ada data struktur organisasi.
                </div>
              ) : (
                <OrgTree nodes={tree} />
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
