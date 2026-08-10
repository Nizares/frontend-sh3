// app/sponsors/page.js
"use client";

import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import { SponsorList } from "../../components/SponsorList";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useSponsor } from "../../hooks/useSponsor";

// 🔥 TIER INFO CONFIG
const tierInfo = {
    platinum: {
        label: "⭐ Platinum",
        color: "bg-gradient-to-r from-purple-600 to-purple-800",
        textColor: "text-purple-700",
        borderColor: "border-purple-400",
        bgLight: "bg-purple-50",
        icon: "👑",
        benefits: [
            "Logo terbesar di semua materi promosi",
            "Posisi utama di banner event",
            "Sosialisasi khusus di semua platform media sosial",
            "Panggung khusus untuk sambutan",
            "Ucapan terima kasih di pembukaan acara",
        ],
    },
    gold: {
        label: "🥇 Gold",
        color: "bg-gradient-to-r from-yellow-500 to-yellow-700",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-400",
        bgLight: "bg-yellow-50",
        icon: "🌟",
        benefits: [
            "Logo di banner event",
            "Sosialisasi di media sosial",
            "Ucapan terima kasih di acara",
            "Pencantuman nama di merchandise event",
        ],
    },
    silver: {
        label: "🥈 Silver",
        color: "bg-gradient-to-r from-gray-400 to-gray-600",
        textColor: "text-gray-600",
        borderColor: "border-gray-300",
        bgLight: "bg-gray-50",
        icon: "✨",
        benefits: [
            "Logo di banner event (ukuran sedang)",
            "Sosialisasi di media sosial",
            "Ucapan terima kasih di acara",
        ],
    },
    bronze: {
        label: "🥉 Bronze",
        color: "bg-gradient-to-r from-orange-500 to-orange-700",
        textColor: "text-orange-700",
        borderColor: "border-orange-400",
        bgLight: "bg-orange-50",
        icon: "🎯",
        benefits: [
            "Logo di banner event",
            "Ucapan terima kasih di acara",
        ],
    },
    "media_partner": {
        label: "📢 Media Partner",
        color: "bg-gradient-to-r from-blue-500 to-blue-700",
        textColor: "text-blue-700",
        borderColor: "border-blue-400",
        bgLight: "bg-blue-50",
        icon: "📰",
        benefits: [
            "Publikasi event di platform media",
            "Liputan khusus acara",
            "Pencantuman logo sebagai media partner",
        ],
    },
};

export default function SponsorsPage() {
    const [selectedYear, setSelectedYear] = useState("all");
    const [availableYears, setAvailableYears] = useState([]);
    const { sponsors, loading } = useSponsor();

    // 🔥 Ambil tahun yang tersedia dari data sponsor
    useEffect(() => {
        if (sponsors) {
            const allSponsors = Object.values(sponsors).flat().filter(s => s.is_active);
            const years = [...new Set(allSponsors.map(s => s.year).filter(y => y !== null && y !== undefined && y !== ""))];
            const sortedYears = years.sort((a, b) => b - a);
            setAvailableYears(sortedYears);
            
            if (sortedYears.length > 0 && selectedYear === "all") {
                setSelectedYear(sortedYears[0]);
            }
        }
    }, [sponsors]);

    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <div className="bg-linear-to-br from-primary-light via-primary-light-active to-primary-light relative">
                <BatikOverlay />
                <div className="mt-8 max-w-306 mx-auto relative px-4 md:px-0">
                    <div className="text-3xl font-bold font-young text-center mt-24">
                        Sponsor
                    </div>
                    <div className="text-3xl font-bold font-young text-center mt-8">
                        Informasi Sponsor
                    </div>
                    
                    {/* 🔥 TIER INFO CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {Object.entries(tierInfo).map(([key, tier]) => (
                            <div 
                                key={key}
                                className={`${tier.bgLight} border-2 ${tier.borderColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className={`text-lg font-bold ${tier.textColor}`}>
                                        {tier.label}
                                    </h3>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {tier.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="text-3xl font-bold font-young text-center mt-8">
                        Sponsor Komunitas kami!
                    </div>

                    {/* 🔥 FILTER TAHUN */}
                    {availableYears.length > 0 && (
                        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                            <label className="font-medium text-lg">Filter Tahun:</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border-2 border-neutral-normal bg-primary-light px-4 py-2 font-young text-lg rounded-md focus:outline-none focus:border-secondary-bg"
                            >
                                <option value="all">Semua Tahun</option>
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                                <option value="Lainnya">Lainnya</option>
                            </select>
                            
                            <span className="text-sm text-neutral-dark bg-primary-light px-3 py-1 rounded-full border border-neutral-normal">
                                {availableYears.length} tahun
                            </span>
                        </div>
                    )}

                    <SponsorList selectedYear={selectedYear} />
                </div>
            </div>
        </Container>
    );
}