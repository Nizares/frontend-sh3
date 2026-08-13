"use client";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useState, useEffect } from "react";
import { organisationService } from "@/src/services/organisationService";
import { EyeIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function About() {
  const [organizationData, setOrganizationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Data dokumen
  const documents = [
    {
      id: 1,
      title: "Akta Pendirian Perkumpulan SH3",
      type: "Akta Notaris",
      documentNumber: "SK.AHU-00125.AH.02.01.Tahun 2018",
      date: "2018",
      driveLink: "https://drive.google.com/file/d/1DyaTY1HOrMSCGzxI_Mx53L03nqJzFnWx/view?usp=sharing",
      description: "Akta pendirian Perkumpulan Samarinda Hash House Harriers"
    },
    {
      id: 2,
      title: "Surat Keterangan Pengesahan Pendirian SH3",
      type: "SK Kemenkumham",
      documentNumber: "AHU-0007083.AH.01.07.TAHUN 2025",
      date: "2025",
      driveLink: "https://drive.google.com/file/d/1K1HEfmEUtipKynOjvMU45ju6CgwD_Wrm/view?usp=sharing",
      description: "Surat keterangan pengesahan badan hukum Perkumpulan SH3"
    },
    {
      id: 3,
      title: "NPWP Perkumpulan SH3",
      type: "NPWP",
      documentNumber: "1000 0000 0605 5331",
      date: "2025",
      driveLink: "https://drive.google.com/file/d/1p6-BiTuxvdTEpRweRRNG4gePwBdmXnsx/view?usp=sharing",
      description: "Nomor Pokok Wajib Pajak Perkumpulan SH3"
    }
  ];

  // 🔥 Ambil data dari API
  useEffect(() => {
    setLoading(true);
    organisationService
      .getAll()
      .then((res) => {
        const data = res.data?.data || [];
        setOrganizationData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching organization:", err);
        setError(err.response?.data?.message || "Gagal memuat data organisasi");
        setOrganizationData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔥 Format period untuk display
  const formatPeriod = (start, end) => {
    if (!start && !end) return "-";
    const startYear = start ? new Date(start).getFullYear() : "";
    const endYear = end ? new Date(end).getFullYear() : "";
    if (startYear && endYear) return `${startYear} - ${endYear}`;
    if (startYear) return `${startYear} - ...`;
    if (endYear) return `... - ${endYear}`;
    return "-";
  };

  return (
    <Container className="flex flex-col">
      <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
        <BatikOverlay />

        {/* Hero + Statistic */}
        <div className="flex flex-col h-screen">
          <div className="relative w-full flex-1 min-h-0 overflow-hidden">
            <Image
              src="/assets/images/aboutimage3.jpg"
              alt="SH3 Story"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary-text/20" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <span className="text-amber-400 font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-3">
                Est. 1988 · Samarinda, East Kalimantan
              </span>
              <h1 className="text-white font-young text-4xl sm:text-5xl md:text-7xl font-bold mb-4">
                Our Story
              </h1>
              <p className="text-neutral-light text-sm md:text-lg max-w-xl bg-secondary-bg/20 rounded-md p-2 text-white">
                Over three decades of running, community, and Borneo spirit.
              </p>
            </div>
          </div>

          <RevealSection direction="up">
            <div className="w-full shrink-0">
              <TotalStatistic />
            </div>
          </RevealSection>
        </div>

        {/* Tentang Kami */}
        <RevealSection direction="up">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-306 mx-auto mb-16 px-4 md:px-0 my-4">
            <div className="relative w-full md:w-1/2 flex justify-center mb-16 sm:mb-0">
              <div className="relative">
                <Image
                  src="/assets/images/aboutimage1.jpg"
                  alt="SH3 Running"
                  width={500}
                  height={500}
                  className="w-full max-w-md rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-yellow-400 flex flex-col items-center justify-center text-center shadow-md">
                  <span className="text-lg font-bold leading-none">30+</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Tahun</span>
                </div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg hidden sm:block p-4 bg-yellow-400/40">
                  <Image
                    src="/assets/images/sh3logo.png"
                    alt="SH3 Activity"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <span className="text-primary-text font-bold text-sm uppercase tracking-widest">
                Siapa Kami
              </span>
              <h2 className="text-4xl font-bold font-young leading-tight">
                Lahir dari Jantung <span className="text-primary-text">Kalimantan</span>
              </h2>
              <p className="text-neutral-text leading-relaxed font-medium">
                SH3 (Samarinda Hash House Harriers) adalah komunitas olahraga lari berbasis di Kota
                Samarinda, Kalimantan Timur. Komunitas ini merupakan bagian dari jaringan Hash House
                Harriers (H3) yang telah dikenal secara internasional sebagai gerakan olahraga sosial yang
                menggabungkan aktivitas lari trail dengan semangat kebersamaan dan persahabatan.
              </p>
              <p className="text-neutral-text leading-relaxed font-medium">
                Kami bukan sekadar klub lari — kami adalah klub minum dengan masalah lari, dan bangga akan
                itu. Dari pelari pemula hingga atlet berpengalaman, setiap hasher menemukan rumah di
                lingkaran kami. Trail berganti setiap minggu, namun semangatnya tak pernah pudar.
              </p>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-neutral-normal/30" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rotate-45 bg-primary-text/30" />
                  ))}
                </div>
                <div className="flex-1 h-px bg-neutral-normal/30" />
              </div>

              <div className="flex flex-col gap-4 mx-auto px-4 md:px-0">
                <div className="flex flex-col md:flex-row w-full justify-center gap-4">
                  <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-md p-2">
                    <div className="font-bold font-young text-xl">Weekly Runs</div>
                    <div className="text-md">Setiap Senin & Sabtu, lokasi berbeda setiap minggu</div>
                  </div>
                  <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-md p-2">
                    <div className="font-bold font-young text-xl">Down Down</div>
                    <div className="text-md">Tradisi Hash yang meriah setelah setiap lari</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row w-full justify-center gap-4">
                  <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-2">
                    <div className="font-bold font-young text-xl">Alam Borneo</div>
                    <div className="text-md">Trail di hutan, sungai, dan bukit Kalimantan</div>
                  </div>
                  <div className="flex flex-col flex-1 border-4 border-emerald-600 text-emerald-600 rounded-sm p-2">
                    <div className="font-bold font-young text-xl">Komunitas</div>
                    <div className="text-md">Inklusif, ramah, dan penuh tawa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Sejarah */}
        <RevealSection direction="up">
          <div className="flex flex-col max-w-306 mx-auto gap-4 p-8">
            <div className="font-bold text-4xl font-young md:p-4">
              Sejarah
            </div>
            <div className="indent-32 text-justify">
              Samarinda Hash House Harriers (SH3) merupakan salah satu komunitas
              olahraga non-prestasi tertua dan paling legendaris di Samarinda
              yang diperkirakan telah berdiri sejak era 1980-an.

              Selama lebih dari tiga puluh tahun berdiri, SH3 Samarinda berhasil
              mempertahankan eksistensinya secara konsisten lintas generasi.

              Salah satu kunci utama mengapa SH3 bisa bertahan sangat lama
              adalah sifatnya yang sangat inklusif dan kekeluargaan.

              Memasuki era modern saat ini, SH3 Samarinda tidak lantas meredup
              di tengah bermunculannya klub lari baru.
            </div>
          </div>
        </RevealSection>

        {/* Dokumen Legal */}
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

        {/* ====== 🔥 STRUKTUR ORGANISASI ====== */}
        <RevealSection direction="up">
          <div className="p-8">
            <div className="flex flex-col max-w-306 mx-auto w-full gap-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="font-bold text-4xl font-young md:p-4">
                  Struktur Organisasi
                </div>
                <span className="text-sm text-neutral-dark bg-primary-light px-3 py-1 rounded-full border border-neutral-normal">
                  {organizationData.length} anggota
                </span>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    <p className="text-neutral-dark">Memuat data organisasi...</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center">
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Tabel organisasi */}
              {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border border-neutral-normal">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-primary-light border-b-2 border-neutral-normal">
                        <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">NAMA</th>
                        <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">JABATAN</th>
                        <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">AKTIF</th>
                        <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">PERIODE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizationData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-neutral-dark">
                            Belum ada data organisasi.
                          </td>
                        </tr>
                      ) : (
                        organizationData.map((member, index) => (
                          <tr
                            key={member.id}
                            className="border-b border-neutral-light hover:bg-primary-light/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-neutral-dark">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              {member.holder?.name || member.name || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-dark">
                              {member.position || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                member.is_active 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {member.is_active ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-dark">
                              {formatPeriod(member.period_start, member.period_end)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </RevealSection>

      </div>
    </Container>
  );
}