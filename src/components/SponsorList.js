// components/SponsorList.js
"use client"

import { useState, useEffect } from "react";
import { useSponsor } from "../hooks/useSponsor";
import Pagination from "@/src/components/Pagination";

function SponsorCard({ sponsor }) {
    const inner = (
        <div className="flex flex-col items-center justify-center gap-2 p-4 transition-colors min-w-30 cursor-pointer hover:bg-primary-light/50 rounded-lg">
            {sponsor.logo_url ? (
                <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="w-20 h-20 object-contain rounded-full"
                />
            ) : (
                // <div className="flex items-center justify-center bg-neutral-bg text-neutral-dark text-xl font-bold font-young w-20 h-20 rounded-full">
                //     {sponsor.name.slice(0, 2).toUpperCase()}
                // </div>
                <img
                    src="assets/images/placeholder.png"
                    alt={sponsor.name}
                    className="w-20 h-20 rounded-full"
                />
            )}
            <div className="text-sm font-semibold text-center">{sponsor.name}</div>
            {sponsor.tier && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    sponsor.tier === "platinum" ? "bg-purple-100 text-purple-700" :
                    sponsor.tier === "gold" ? "bg-yellow-100 text-yellow-700" :
                    sponsor.tier === "silver" ? "bg-gray-100 text-gray-600" :
                    sponsor.tier === "bronze" ? "bg-orange-100 text-orange-700" :
                    "bg-gray-100 text-gray-500"
                }`}>
                    {sponsor.tier.toUpperCase()}
                </span>
            )}
        </div>
    )

    if (sponsor.website) {
        return (
            <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
            >
                {inner}
            </a>
        )
    }

    return <div>{inner}</div>
}

export function SponsorList({ selectedYear = "all" }) {
    const { sponsors, loading, error } = useSponsor();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // 🔥 Reset ke halaman 1 saat filter berubah (menggunakan useEffect)
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedYear]);

    if (loading) return <p className="min-h-screen text-center text-2xl p-16">Loading ....</p>;
    if (error) return <p className="min-h-screen text-center text-2xl p-16">Gagal Memuat Sponsor</p>;
    if (!sponsors) return null;

    const allSponsors = Object.values(sponsors).flat().filter(s => s.is_active);

    if (allSponsors.length === 0) return <p className="min-h-screen text-center text-2xl p-16">Belum ada Sponsor</p>;

    // 🔥 Filter berdasarkan tahun yang dipilih
    let filteredSponsors = allSponsors;
    if (selectedYear !== "all") {
        if (selectedYear === "Lainnya") {
            filteredSponsors = allSponsors.filter(s => !s.year || s.year === "Lainnya");
        } else {
            filteredSponsors = allSponsors.filter(s => String(s.year) === String(selectedYear));
        }
    }

    if (filteredSponsors.length === 0) {
        return (
            <div className="text-center py-16 text-neutral-dark">
                <p className="text-2xl">Tidak ada sponsor untuk tahun {selectedYear}.</p>
            </div>
        );
    }

    // 🔥 Pagination logic
    const totalItems = filteredSponsors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredSponsors.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🔥 Group by year
    const groupedByYear = currentItems.reduce((acc, sponsor) => {
        const year = sponsor.year ?? "Lainnya";
        if (!acc[year]) acc[year] = [];
        acc[year].push(sponsor);
        return acc;
    }, {});

    // 🔥 Urutkan tahun (terbaru dulu, "Lainnya" di akhir)
    const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
        if (a === "Lainnya") return 1;
        if (b === "Lainnya") return -1;
        return b - a;
    });

    // 🔥 Count total per tahun
    const getYearCount = (year) => groupedByYear[year]?.length || 0;

    return (
        <section className="py-10 px-6 min-h-screen">
            <div className="flex flex-col gap-10">
                {sortedYears.map((year) => (
                    <div key={year} className="flex flex-col gap-4">
                        <div className="flex items-center justify-center gap-3">
                            <h3 className="text-lg font-semibold text-primary-darker">
                                {year === "Lainnya" ? "Lainnya" : `${year}`}
                            </h3>
                            <span className="text-sm text-neutral-dark bg-primary-light px-2 py-0.5 rounded-full border border-neutral-normal">
                                {getYearCount(year)} sponsor
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {groupedByYear[year].map((sponsor) => (
                                <SponsorCard key={sponsor.id} sponsor={sponsor} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    )
}