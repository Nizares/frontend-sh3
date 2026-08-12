"use client";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useState } from "react";
import { EyeIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function About() {
  // 🔥 Data statis organisasi (sesuai gambar)
const organizationData = [
  // 1. PIMPINAN INTI & SEKRETARIS
  { id: 1, name: "Minardi Soetomo", position: "Hash Master (Ketua Umum)", order: 1, active: true, period: "2024 - 2027" },
  { id: 2, name: "Haryanto Widjojo", position: "Vice Master (Wakil Ketua I)", order: 2, active: true, period: "2024 - 2027" },
  { id: 3, name: "Veronika", position: "Joint Master I (Wakil Ketua II)", order: 3, active: true, period: "2024 - 2027" },
  { id: 4, name: "Handria Suryadinata", position: "Joint Master II (Wakil Ketua III)", order: 4, active: true, period: "2024 - 2027" },
  { id: 5, name: "Conan Luhas", position: "Hash Secretary (Wakil Ketua IV / Sekretaris Umum)", order: 5, active: true, period: "2024 - 2027" },

  // 2. PENASIHAT (DIPINDAHKAN DI BAWAH SEKRETARIS)
  { id: 6, name: "Amin Setiawan", position: "Penasihat", order: 6, active: true, period: "2024 - 2027" },
  { id: 7, name: "Rudianto W", position: "Penasihat", order: 7, active: true, period: "2024 - 2027" },
  { id: 8, name: "Alexander", position: "Penasihat", order: 8, active: true, period: "2024 - 2027" },
  { id: 9, name: "H Amin", position: "Penasihat", order: 9, active: true, period: "2024 - 2027" },
  { id: 10, name: "Johan Lim", position: "Penasihat", order: 10, active: true, period: "2024 - 2027" },
  { id: 11, name: "Ibu Bertine", position: "Penasihat", order: 11, active: true, period: "2024 - 2027" },

  // 3. BENDAHARA
  { id: 12, name: "Mulyadi Widjojo", position: "Bendahara", order: 12, active: true, period: "2024 - 2027" },
  { id: 13, name: "Natalia Rosalie", position: "Wakil Bendahara", order: 13, active: true, period: "2024 - 2027" },

  // 4. SEKSI-SEKSI DI BAWAH JOINT MASTER I (Veronika)
  // Seksi Konsumsi (Minuman)
  { id: 14, name: "Ko Asun", position: "Anggota Seksi Konsumsi (Minuman)", order: 14, active: true, period: "2024 - 2027" },
  { id: 15, name: "Aliang", position: "Anggota Seksi Konsumsi (Minuman)", order: 15, active: true, period: "2024 - 2027" },
  { id: 16, name: "Afu (Willy Antonio)", position: "Anggota Seksi Konsumsi (Minuman)", order: 16, active: true, period: "2024 - 2027" },
  { id: 17, name: "Sentoy", position: "Anggota Seksi Konsumsi (Minuman)", order: 17, active: true, period: "2024 - 2027" },
  { id: 18, name: "Asmuran", position: "Anggota Seksi Konsumsi (Minuman)", order: 18, active: true, period: "2024 - 2027" },
  { id: 19, name: "Sri Rahayu", position: "Anggota Seksi Konsumsi (Minuman)", order: 19, active: true, period: "2024 - 2027" },
  { id: 20, name: "Ko Atu (Turunsyah)", position: "Anggota Seksi Konsumsi (Minuman)", order: 20, active: true, period: "2024 - 2027" },
  { id: 21, name: "Rohmah", position: "Anggota Seksi Konsumsi (Minuman)", order: 21, active: true, period: "2024 - 2027" },
  // Seksi Konsumsi (Makanan)
  { id: 22, name: "Bu Susi", position: "Anggota Seksi Konsumsi (Makanan)", order: 22, active: true, period: "2024 - 2027" },
  { id: 23, name: "Achen", position: "Anggota Seksi Konsumsi (Makanan)", order: 23, active: true, period: "2024 - 2027" },
  { id: 24, name: "Rini", position: "Anggota Seksi Konsumsi (Makanan)", order: 24, active: true, period: "2024 - 2027" },
  { id: 25, name: "Rohman", position: "Anggota Seksi Konsumsi (Makanan)", order: 25, active: true, period: "2024 - 2027" },
  { id: 26, name: "Latifah", position: "Anggota Seksi Konsumsi (Makanan)", order: 26, active: true, period: "2024 - 2027" },
  { id: 27, name: "Sri Rahayu", position: "Anggota Seksi Konsumsi (Makanan)", order: 27, active: true, period: "2024 - 2027" },
  { id: 28, name: "Kevin", position: "Anggota Seksi Konsumsi (Makanan)", order: 28, active: true, period: "2024 - 2027" },
  // Seksi Acara
  { id: 29, name: "Baseg", position: "Anggota Seksi Acara", order: 29, active: true, period: "2024 - 2027" },
  { id: 30, name: "Ko Casun", position: "Anggota Seksi Acara", order: 30, active: true, period: "2024 - 2027" },
  { id: 31, name: "Linda", position: "Anggota Seksi Acara", order: 31, active: true, period: "2024 - 2027" },
  { id: 32, name: "Joni", position: "Anggota Seksi Acara", order: 32, active: true, period: "2024 - 2027" },
  { id: 33, name: "Sarimole", position: "Anggota Seksi Acara", order: 33, active: true, period: "2024 - 2027" },
  { id: 34, name: "Amok", position: "Anggota Seksi Acara", order: 34, active: true, period: "2024 - 2027" },
  { id: 35, name: "Amben", position: "Anggota Seksi Acara", order: 35, active: true, period: "2024 - 2027" },
  { id: 36, name: "Tina", position: "Anggota Seksi Acara", order: 36, active: true, period: "2024 - 2027" },
  // Seksi P3K
  { id: 37, name: "Dr. Johanes", position: "Ketua Seksi P3K", order: 37, active: true, period: "2024 - 2027" },
  { id: 38, name: "Dr. Teni Jirri", position: "Anggota Seksi P3K", order: 38, active: true, period: "2024 - 2027" },
  { id: 39, name: "Dr. Abraham Jirri", position: "Anggota Seksi P3K", order: 39, active: true, period: "2024 - 2027" },
  { id: 40, name: "Las Sugiarto", position: "Anggota Seksi P3K", order: 40, active: true, period: "2024 - 2027" },
  { id: 41, name: "Bonny", position: "Anggota Seksi P3K", order: 41, active: true, period: "2024 - 2027" },
  // Seksi KAMTIB
  { id: 42, name: "Pak Rojan", position: "Anggota Seksi KAMTIB", order: 42, active: true, period: "2024 - 2027" },
  { id: 43, name: "Hardiy Ev", position: "Anggota Seksi KAMTIB", order: 43, active: true, period: "2024 - 2027" },
  { id: 44, name: "H. Hasan", position: "Anggota Seksi KAMTIB", order: 44, active: true, period: "2024 - 2027" },
  { id: 45, name: "Aris", position: "Anggota Seksi KAMTIB", order: 45, active: true, period: "2024 - 2027" },

  // 5. SEKSI-SEKSI DI BAWAH JOINT MASTER II (Handria Suryadinata)
  // Seksi Sponsorship
  { id: 46, name: "Johan Sugiarto", position: "Ketua Seksi Sponsorship", order: 46, active: true, period: "2024 - 2027" },
  { id: 47, name: "Agus Widya (Hasan)", position: "Anggota Seksi Sponsorship", order: 47, active: true, period: "2024 - 2027" },
  { id: 48, name: "Budi Kang", position: "Anggota Seksi Sponsorship", order: 48, active: true, period: "2024 - 2027" },
  { id: 49, name: "Sri Rahayu", position: "Anggota Seksi Sponsorship", order: 49, active: true, period: "2024 - 2027" },
  // Seksi Perlengkapan
  { id: 50, name: "Baseg", position: "Anggota Seksi Perlengkapan", order: 50, active: true, period: "2024 - 2027" },
  { id: 51, name: "Marsono (Along)", position: "Anggota Seksi Perlengkapan", order: 51, active: true, period: "2024 - 2027" },
  { id: 52, name: "Las Sugiarto", position: "Anggota Seksi Perlengkapan", order: 52, active: true, period: "2024 - 2027" },
  { id: 53, name: "Mika", position: "Anggota Seksi Perlengkapan", order: 53, active: true, period: "2024 - 2027" },
  { id: 54, name: "Akwang", position: "Anggota Seksi Perlengkapan", order: 54, active: true, period: "2024 - 2027" },
  { id: 55, name: "Ronny C", position: "Anggota Seksi Perlengkapan", order: 55, active: true, period: "2024 - 2027" },
  // Seksi Marketing & Promosi
  { id: 56, name: "Leny Ana", position: "Anggota Seksi Marketing & Promosi", order: 56, active: true, period: "2024 - 2027" },
  { id: 57, name: "Budi Kang", position: "Anggota Seksi Marketing & Promosi", order: 57, active: true, period: "2024 - 2027" },
  { id: 58, name: "Teddy Tarimole", position: "Anggota Seksi Marketing & Promosi", order: 58, active: true, period: "2024 - 2027" },
  // Seksi Dokumentasi
  { id: 59, name: "Armanto", position: "Anggota Seksi Dokumentasi (Foto)", order: 59, active: true, period: "2024 - 2027" },
  { id: 60, name: "William", position: "Anggota Seksi Dokumentasi (Foto/Video)", order: 60, active: true, period: "2024 - 2027" },
  { id: 61, name: "Conan", position: "Anggota Seksi Dokumentasi (Video)", order: 61, active: true, period: "2024 - 2027" },
  { id: 62, name: "Ermanto", position: "Anggota Seksi Dokumentasi (Foto)", order: 62, active: true, period: "2024 - 2027" },
  { id: 63, name: "Tata", position: "Anggota Seksi Dokumentasi", order: 63, active: true, period: "2024 - 2027" },
  // Seksi Merchandising
  { id: 64, name: "Megawati (IPAC)", position: "Anggota Seksi Merchandising", order: 64, active: true, period: "2024 - 2027" },
  { id: 65, name: "Rini", position: "Anggota Seksi Merchandising", order: 65, active: true, period: "2024 - 2027" },
  { id: 66, name: "Latifah", position: "Anggota Seksi Merchandising", order: 66, active: true, period: "2024 - 2027" },

  // 6. SEKSI-SEKSI DI BAWAH HASH SECRETARY (Conan Luhas)
  // Seksi Hare
  { id: 67, name: "Arbin Heng", position: "Ketua Seksi Hare", order: 67, active: true, period: "2024 - 2027" },
  { id: 68, name: "Wimi (Didi Gunawan)", position: "Wakil Ketua Seksi Hare", order: 68, active: true, period: "2024 - 2027" },
  { id: 69, name: "Hardanto Subro", position: "Anggota Seksi Hare", order: 69, active: true, period: "2024 - 2027" },
  { id: 70, name: "Asmiran", position: "Anggota Seksi Hare", order: 70, active: true, period: "2024 - 2027" },
  { id: 71, name: "Indra Toyo", position: "Anggota Seksi Hare", order: 71, active: true, period: "2024 - 2027" },
  { id: 72, name: "Valen", position: "Anggota Seksi Hare", order: 72, active: true, period: "2024 - 2027" },
  { id: 73, name: "Ali Sanjaya", position: "Anggota Seksi Hare", order: 73, active: true, period: "2024 - 2027" },
  { id: 74, name: "Titi", position: "Anggota Seksi Hare", order: 74, active: true, period: "2024 - 2027" },
  { id: 75, name: "Lekong", position: "Anggota Seksi Hare", order: 75, active: true, period: "2024 - 2027" },
  { id: 76, name: "Arek", position: "Anggota Seksi Hare", order: 76, active: true, period: "2024 - 2027" },
  { id: 77, name: "Achien", position: "Anggota Seksi Hare", order: 77, active: true, period: "2024 - 2027" },
  { id: 78, name: "Mithal", position: "Anggota Seksi Hare", order: 78, active: true, period: "2024 - 2027" },
  { id: 79, name: "Jobs", position: "Anggota Seksi Hare", order: 79, active: true, period: "2024 - 2027" },
  // Seksi Operasional
  { id: 80, name: "Joni Dentu", position: "Anggota Seksi Operasional", order: 80, active: true, period: "2024 - 2027" },
  { id: 81, name: "Mali Mangur", position: "Anggota Seksi Operasional", order: 81, active: true, period: "2024 - 2027" },
  { id: 82, name: "Andre Iman", position: "Anggota Seksi Operasional", order: 82, active: true, period: "2024 - 2027" },
  { id: 83, name: "Rachel", position: "Anggota Seksi Operasional", order: 83, active: true, period: "2024 - 2027" },
  { id: 84, name: "Moka", position: "Anggota Seksi Operasional", order: 84, active: true, period: "2024 - 2027" },
  // Seksi Legal
  { id: 85, name: "Pak Ferry", position: "Anggota Seksi Legal", order: 85, active: true, period: "2024 - 2027" },
  // Seksi Pendaftaran Anggota
  { id: 86, name: "Sari San", position: "Anggota Seksi Pendaftaran Anggota", order: 86, active: true, period: "2024 - 2027" },
  { id: 87, name: "Muryani Tjong", position: "Anggota Seksi Pendaftaran Anggota", order: 87, active: true, period: "2024 - 2027" },
  { id: 88, name: "Subhan Agus / Riri", position: "Anggota Seksi Pendaftaran Anggota", order: 88, active: true, period: "2024 - 2027" },
  { id: 89, name: "Lirus", position: "Anggota Seksi Pendaftaran Anggota", order: 89, active: true, period: "2024 - 2027" },
  { id: 90, name: "Megawati (IPAC)", position: "Anggota Seksi Pendaftaran Anggota", order: 90, active: true, period: "2024 - 2027" },
  { id: 91, name: "Linda", position: "Anggota Seksi Pendaftaran Anggota", order: 91, active: true, period: "2024 - 2027" },
  // Seksi Pengihubung Lapangan
  { id: 92, name: "Glen Mario", position: "Anggota Seksi Pengihubung Lapangan", order: 92, active: true, period: "2024 - 2027" },
  { id: 93, name: "Las Sugiarto", position: "Anggota Seksi Pengihubung Lapangan", order: 93, active: true, period: "2024 - 2027" },
  { id: 94, name: "Hardan Eky", position: "Anggota Seksi Pengihubung Lapangan", order: 94, active: true, period: "2024 - 2027" },
];

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
              </div>

              {/* Tabel organisasi */}
              <div className="overflow-x-auto rounded-lg border border-neutral-normal">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-primary-light border-b-2 border-neutral-normal">
                      <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">NAME</th>
                      <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">POSITION</th>
                      <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">ORDER</th>
                      <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">ACTIVE</th>
                      <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider">PERIOD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizationData.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-neutral-light hover:bg-primary-light/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-neutral-dark">
                          {member.id}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {member.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-dark">
                          {member.position}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-dark">
                          {member.order}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            member.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {member.active ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-dark">
                          {member.period}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </RevealSection>

      </div>
    </Container>
  );
}