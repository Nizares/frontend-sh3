// components/SponsorList.js
"use client"

import { useSponsor } from "../hooks/useSponsor";

function SponsorCard({ sponsor }) {
    const inner = (
        <div className="flex flex-col items-center justify-center gap-2 p-4 transition-colors min-w-30 cursor-pointer ">
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
            <div className="text-sm font-semibold text-center">{sponsor.name}</div>
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

export function SponsorList() {
    const { sponsors, loading, error } = useSponsor();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Gagal memuat sponsor.</p>;
    if (!sponsors) return null;

    const allSponsors = Object.values(sponsors).flat().filter(s => s.is_active);

    if (allSponsors.length === 0) return null;

    return (
        <section className="py-10 px-6">

            <div className="flex flex-wrap justify-center gap-6">
                {allSponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
            </div>
        </section>
    )
}