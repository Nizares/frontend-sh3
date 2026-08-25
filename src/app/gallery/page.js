// src/app/gallery/page.js
"use client"

import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import MasonryGallery from "@/src/components/MasonryGallery";
import { galleryService } from "@/src/services/galleryService";
import BatikOverlay from "@/src/components/BatikOverlay";
import Link from "next/link";

import AlbumCard from "@/src/components/AlbumCard";


export default function Gallery() {
    const [allImages, setAllImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [availableStatuses, setAvailableStatuses] = useState([]);

    const statusOptions = [
        { value: "publish", label: "Akan Datang" },
        { value: "ongoing", label: "Berlangsung" },
        { value: "completed", label: "Selesai" },
        { value: "cancelled", label: "Dibatalkan" },
    ];

    // 🔥 Fetch Galleries
    useEffect(() => {
        galleryService
            .getAll()
            .then((res) => {
                const galleries = res.data?.data || [];
                
                const mappedImages = galleries
                    .filter((g) => g.type === "image" || !g.type)
                    .map((gallery) => {
                        const status = gallery.event?.status || "";
                        const event = gallery.event || {};
                        const eventDate = event.start_date || event.created_at || gallery.created_at || "";
                        
                        return {
                            id: gallery.id,
                            url: gallery.url || gallery.thumb || "",
                            title: gallery.title || "Foto Event",
                            subtitle: event.title || "",
                            status: status,
                            is_featured: gallery.is_featured || false,
                            event_id: event.id || null,
                            event_title: event.title || "",
                            event_date: eventDate,
                        };
                    })
                    .filter((img) => img.url && img.url !== "");
                
                // 🔥 Sorting: featured first, then latest event date
                const sortedImages = mappedImages.sort((a, b) => {
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    
                    const dateA = new Date(a.event_date);
                    const dateB = new Date(b.event_date);
                    
                    if (!a.event_date) return 1;
                    if (!b.event_date) return -1;
                    
                    return dateB - dateA;
                });
                
                setAllImages(sortedImages);
                setFilteredImages(sortedImages);
                
                const statuses = [...new Set(sortedImages.map(img => img.status).filter(s => s !== ""))];
                setAvailableStatuses(statuses);
                
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching galleries:", err);
                setError(err.response?.data?.message || "Gagal memuat galeri");
                setAllImages([]);
                setFilteredImages([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // 🔥 Fetch Albums (Baru!)
    useEffect(() => {
        galleryService
            .getAlbums()
            .then((res) => {
                const albumData = res.data?.data || [];
                setAlbums(albumData);
            })
            .catch((err) => {
                console.error("Error fetching albums:", err);
                // Tidak set error global, hanya log
            })
            .finally(() => setLoadingAlbums(false));
    }, []);

    // 🔥 Filter berdasarkan status
    useEffect(() => {
        if (selectedStatus === "all") {
            setFilteredImages(allImages);
        } else {
            const filtered = allImages.filter(img => img.status === selectedStatus);
            setFilteredImages(filtered);
        }
    }, [selectedStatus, allImages]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const getStatusLabel = (status) => {
        const found = statusOptions.find(s => s.value === status);
        return found ? found.label : status;
    };

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                    <BatikOverlay />
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-lg">Memuat galeri...</p>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
                <BatikOverlay />
                <div className="gap-y-4 max-w-306 mx-auto px-4 md:px-0">
                    <h1 className="text-5xl font-bold text-center p-8 font-young mt-16">
                        Cerita Kami saat Berlari!
                    </h1>

                    {/* 🔥 SECTION ALBUM (Baru!) */}
                    {!loadingAlbums && albums.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-4 px-4">
                                <h2 className="text-2xl font-bold">Album Galeri</h2>
                                <Link 
                                    href="/gallery/albums" 
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Lihat Semua →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {albums.slice(0, 4).map((album) => (
                                    <AlbumCard key={album.id} album={album} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 🔥 SECTION FEATURED PHOTOS */}
                    <div className="px-4">
                        <h2 className="text-2xl font-bold mb-4">Foto Pilihan</h2>
                    </div>

                    {/* 🔥 FILTER STATUS */}
                    {availableStatuses.length > 0 && (
                        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 px-4">
                            <label className="font-medium text-lg">Filter Status:</label>
                            <select
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                className="border-2 border-neutral-normal bg-primary-light px-4 py-2 font-young text-lg rounded-md focus:outline-none focus:border-secondary-bg"
                            >
                                <option value="all">Semua Status</option>
                                {availableStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {getStatusLabel(status)}
                                    </option>
                                ))}
                            </select>
                            
                            <span className="text-sm text-neutral-dark bg-primary-light px-3 py-1 rounded-full border border-neutral-normal">
                                {filteredImages.length} foto
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mx-4">
                            <p>{error}</p>
                        </div>
                    )}

                    {filteredImages.length === 0 && !error ? (
                        <p className="text-center text-2xl py-16 min-h-screen text-neutral-dark">
                            {selectedStatus !== "all" 
                                ? `Tidak ada foto dengan status "${getStatusLabel(selectedStatus)}".` 
                                : "Belum ada foto event."}
                        </p>
                    ) : (
                        <MasonryGallery 
                            images={filteredImages}
                            renderCard={(image) => <GalleryCard image={image} />}
                        />
                    )}
                </div>
            </div>
        </Container>
    );
}