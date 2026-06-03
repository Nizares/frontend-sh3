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

                // console.log(events);
                const mappedImages = events.flatMap(event =>
                    
                    (event.galleries || []).map(url => ({  // ← hapus .slice(0,2)
                        url,
                        title: event.title,
                        subtitle: event.category?.name ?? "",
                        id: event.id,  // ← tambah ini untuk link ke detail
                        status: event.status
                    }))
                );

                setImages(mappedImages);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex justify-center p-16 text-2xl">Loading...</div>;
    }

    return (
        <Container className="flex flex-col gap-y-4 w-full max-w-306 mx-auto">
            <h1 className="text-5xl font-bold text-center p-8 font-young text-neutral-normal">Cerita Kami saat Berlari!</h1>

            {images.length === 0 ? (
                <p className="text-center text-shadow-neutral-normal py-16">Belum ada foto event.</p>
            ) : (
                <MasonryGallery images={images} />
            )}
        </Container>
    );
}