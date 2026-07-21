"use client";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image";
import StructureProfileCard from "@/src/components/StructureProfileCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useState, useEffect } from "react";
import { organisationService } from "@/src/services/organisationService";
import { EyeIcon, DocumentTextIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function About() {
  const [tree, setTree] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
// 🔥 Data dokumen
const documents = [
  {
    id: 1,
    title: "Akta Pendirian Perkumpulan SH3",
    type: "Akta Notaris",
    documentNumber: "SK.AHU-00125.AH.02.01.Tahun 2018", // ← tambah
    date: "2018",
    driveLink: "https://drive.google.com/file/d/1DyaTY1HOrMSCGzxI_Mx53L03nqJzFnWx/view?usp=sharing",
    description: "Akta pendirian Perkumpulan Samarinda Hash House Harriers"
  },
  {
    id: 2,
    title: "Surat Keterangan Pengesahan Pendirian SH3",
    type: "SK Kemenkumham",
    documentNumber: "AHU-0007083.AH.01.07.TAHUN 2025", // ← tambah
    date: "2025",
    driveLink: "https://drive.google.com/file/d/1K1HEfmEUtipKynOjvMU45ju6CgwD_Wrm/view?usp=sharing",
    description: "Surat keterangan pengesahan badan hukum Perkumpulan SH3"
  },
  {
    id: 3,
    title: "NPWP Perkumpulan SH3",
    type: "NPWP",
    documentNumber: "1000 0000 0605 5331", // ← tambah
    date: "2025",
    driveLink: "https://drive.google.com/file/d/1p6-BiTuxvdTEpRweRRNG4gePwBdmXnsx/view?usp=sharing",
    description: "Nomor Pokok Wajib Pajak Perkumpulan SH3"
  }
];

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
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  return (
    <Container className="flex flex-col">
      <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
        <BatikOverlay />

        {/* Header */}
        <div className="flex flex-col flex-1 items-center justify-center  p-8 mt-16">
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
              <p className="text-4xl font-bold font-young ">
                A Drinking Club With a Running Problem
              </p>
              <h2 className="text-3xl font-bold font-young ">
                Samarinda <span className="text-primary-text">Hash</span> House
                Harriers
              </h2>
              <p className="text-neutral-text leading-relaxed font-medium">
                SH3 (Samarinda Hash House Harriers) adalah komunitas olahraga lari berbasis di Kota
                Samarinda, Kalimantan Timur. Komunitas ini merupakan bagian dari jaringan Hash House
                Harriers (H3) yang telah dikenal secara internasional sebagai gerakan olahraga sosial yang
                menggabungkan aktivitas lari trail dengan semangat kebersamaan dan persahabatan.
              </p>
              <p className="text-neutral-text leading-relaxed font-medium">
                SH3 secara rutin menyelenggarakan kegiatan lari mingguan yang diikuti oleh peserta dari
                berbagai latar belakang, mulai dari pelari pemula hingga atlet berpengalaman, dengan
                jumlah rata-rata 200 peserta setiap minggunya. Kegiatan ini menjadi wadah komunitas yang
                aktif, sehat, dan berdampak positif bagi lingkungan serta masyarakat sekitar.
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
            <div className="font-bold text-4xl font-young md:p-4 ">
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

        {/* 🔥 TABEL DOKUMEN - Pengganti iframe PDF */}
        {/* 🔥 TABEL DOKUMEN */}
<RevealSection direction="up">
  <div className="flex flex-col max-w-306 mx-auto px-4 md:px-0 py-8">
    <div className="font-bold text-4xl font-young md:p-4 mb-6">
      Dokumen Legal Perkumpulan
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-primary-light border-b-2 border-neutral-normal">
            <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">No</th>
            <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">Nama Dokumen</th>
            <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">Tipe</th>
            <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">No. Dokumen</th>
            <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">Tanggal</th>
            <th className="px-6 py-4 text-center font-bold text-sm uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr 
              key={doc.id} 
              className="border-b border-neutral-light hover:bg-primary-light/50 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium text-neutral-dark">
                {index + 1}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{doc.title}</span>
                  <span className="text-xs text-gray-500">{doc.description}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                  {doc.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-neutral-dark">
                {doc.documentNumber || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-neutral-dark">
                {doc.date}
              </td>
              <td className="px-6 py-4 text-center">
                <a
                  href={doc.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-bg text-white font-medium rounded-md hover:bg-secondary-bg-hover transition-colors text-sm"
                >
                  <EyeIcon className="w-4 h-4" />
                  Lihat
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="text-sm text-neutral-dark mt-4 text-center">
      Klik tombol <b>Lihat</b> untuk membuka dokumen di Google Drive
    </p>
  </div>
</RevealSection>

        {/* Struktur Organisasi dari API */}
        <RevealSection direction="up">
          <div className="p-8">
            <div className="flex flex-col max-w-306 mx-auto w-full gap-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="font-bold text-4xl font-young md:p-4 ">
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