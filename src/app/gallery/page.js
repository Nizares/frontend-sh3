"use client"

import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import MasonryGallery from "@/src/components/MasonryGallery";
import { eventService } from "@/src/services/eventService";
import { RevealSection } from "@/src/components/RevealSection";

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventService.getAll({ per_page: 100 })
            .then(res => {
                const events = res.data.data ?? [];

                const mappedImages = events.map(event => ({
                    id: event.id,
                    url: event.galleries?.[0] ?? null,  // ambil 1 gambar pertama saja
                    title: event.title,
                    subtitle: event.category?.name ?? "",
                    status: event.status,
                })).filter(img => img.url); // buang event yang tidak punya gambar

                setImages(mappedImages);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex justify-center p-16 text-2xl h-screen mt-16">Loading...</div>;
    }

    return (
        <Container className="flex flex-col  w-full ">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
                <div
                    className="absolute top-0 left-0 h-full w-28 bg-repeat-y bg-left mask-r-from-5%"
                    style={{
                        backgroundImage: `url('/assets/images/batik4.svg')`,
                        backgroundSize: "112px",
                    }}
                />
                <div
                    className="absolute top-0 right-0 h-full w-28 bg-repeat-y bg-left -scale-x-100 mask-r-from-5%"
                    style={{
                        backgroundImage: `url('/assets/images/batik4.svg')`,
                        backgroundSize: "112px",
                    }}
                />
                <div className="gap-y-4 max-w-306 mx-auto">
                    <h1 className="text-5xl font-bold text-center p-8 font-young text-primary-dark mt-16">Cerita Kami saat Berlari!</h1>

                    {images.length === 0 ? (
                        <p className="text-center text-xl py-16 min-h-screen">Belum ada foto event.</p>
                    ) : (
                        <MasonryGallery images={images} />
                    )}
                </div>

            </div>

        </Container>
    );
}