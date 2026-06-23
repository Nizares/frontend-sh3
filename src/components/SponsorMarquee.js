// components/SponsorList.js
"use client"

import { useSponsor } from "../hooks/useSponsor";

function SponsorCard({ sponsor }) {
    const inner = (
        <div className="flex flex-col items-center justify-center gap-2 p-4 min-w-[120px] cursor-pointer">
            {sponsor.logo_url ? (
                <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="w-20 h-20 object-contain"
                />
            ) : (
                <div className="flex items-center justify-center bg-neutral-bg text-neutral-dark text-xl font-bold font-young w-20 h-20">
                    {sponsor.name.slice(0, 2).toUpperCase()}
                </div>
            )}
            <div className="text-sm font-semibold text-center text-white">{sponsor.name}</div>
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

export function SponsorMarquee() {
    const { sponsors, loading, error } = useSponsor();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Gagal memuat sponsor.</p>;
    if (!sponsors) return null;

    const allSponsors = Object.values(sponsors).flat().filter(s => s.is_active);

    if (allSponsors.length === 0) return <p className="min-h-screen text-center text-2xl p-16">Belum ada Sponsor</p>;

    // Ambil 5 sponsor pertama, lalu duplikat untuk efek marquee seamless
    const topSponsors = allSponsors.slice(0, 5);
    const marqueeItems = [...topSponsors, ...topSponsors];

    return (
        <section className="py-10 px-6">
            <div className="overflow-hidden w-full">
                <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused]">
                    {marqueeItems.map((sponsor, index) => (
                        <SponsorCard key={`${sponsor.id}-${index}`} sponsor={sponsor} />
                    ))}
                </div>
            </div>
        </section>
    )
}