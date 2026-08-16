"use client"

import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import MasonryGallery from "@/src/components/MasonryGallery";
import { galleryService } from "@/src/services/galleryService";
import BatikOverlay from "@/src/components/BatikOverlay";
import Link from "next/link";

// 🔥 Komponen Card
function GalleryCard({ image }) {
    let link = null;
    if (image.event_id) {
        if (image.status === "ongoing" || image.status === "upcoming") {
            link = `/events/upcoming?id=${image.event_id}`;
        } else {
            link = `/events/finished?id=${image.event_id}`;
        }
    }

    return (
        <Link
            href={link || "#"}
            className={`block group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${
                !link ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={(e) => {
                if (!link) {
                    e.preventDefault();
                }
            }}
        >
            <div className="relative w-full overflow-hidden bg-gray-100">
                <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = "/images/placeholder-image.jpg";
                    }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-sm md:text-base">
                        {image.title}
                    </h3>
                    {image.subtitle && (
                        <p className="text-white/80 text-xs md:text-sm">
                            {image.subtitle}
                        </p>
                    )}
                    {link && (
                        <span className="text-white/60 text-xs mt-1 flex items-center gap-1">
                            Lihat Event →
                        </span>
                    )}
                </div>
            </div>
            
            {image.status && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold text-white ${
                    image.status === "ongoing" ? "bg-green-500" :
                    image.status === "upcoming" ? "bg-blue-500" :
                    image.status === "publish" ? "bg-blue-500" :
                    image.status === "completed" ? "bg-purple-500" :
                    image.status === "cancelled" ? "bg-red-500" :
                    "bg-gray-500"
                }`}>
                    {image.status === "ongoing" ? "Berlangsung" :
                     image.status === "upcoming" || image.status === "publish" ? "Akan Datang" :
                     image.status === "completed" ? "✅ Selesai" :
                     image.status === "cancelled" ? "❌ Dibatalkan" :
                     image.status}
                </div>
            )}
            
            {image.is_featured && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-400 text-black">
                    ⭐ Featured
                </div>
            )}
        </Link>
    );
}

export default function Gallery() {
    const [allImages, setAllImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [availableStatuses, setAvailableStatuses] = useState([]);

    // 🔥 Status options
    const statusOptions = [
        { value: "publish", label: "Akan Datang" },
        { value: "ongoing", label: "Berlangsung" },
        { value: "completed", label: "Selesai" },
        { value: "cancelled", label: "Dibatalkan" },
    ];

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
                        
                        // 🔥 Ambil tanggal event (start_date atau created_at)
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
                            // 🔥 Untuk sorting
                            event_date: eventDate,
                        };
                    })
                    .filter((img) => img.url && img.url !== "");
                
                // 🔥 SORTING: Featured first, then by latest event date
                const sortedImages = mappedImages.sort((a, b) => {
                    // 1. Featured diutamakan
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    
                    // 2. Urutkan berdasarkan tanggal event terbaru
                    const dateA = new Date(a.event_date);
                    const dateB = new Date(b.event_date);
                    
                    // Jika salah satu tidak punya tanggal, taruh di akhir
                    if (!a.event_date) return 1;
                    if (!b.event_date) return -1;
                    
                    return dateB - dateA; // Descending (terbaru dulu)
                });
                
                setAllImages(sortedImages);
                setFilteredImages(sortedImages);
                
                // 🔥 Generate list status yang tersedia
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

    // 🔥 Helper untuk mendapatkan label status
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

                    {/* 🔥 FILTER STATUS */}
                    {availableStatuses.length > 0 && (
                        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
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