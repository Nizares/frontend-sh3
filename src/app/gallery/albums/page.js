// src/app/gallery/albums/page.js
"use client";

import Container from "@/src/components/Container";
import AlbumCard from "@/src/components/AlbumCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import { galleryService } from "@/src/services/galleryService";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import Pagination from "@/src/components/Pagination";

const ITEMS_PER_PAGE = 6;
const MAX_PAGES = 2;

export default function GalleryAlbums() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    
    const [allAlbums, setAllAlbums] = useState([]); // 🔥 Simpan semua album
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= MAX_PAGES) {
            router.push(`/gallery/albums?page=${page}`);
        }
    };

    // 🔥 Fetch semua album (tanpa pagination dari backend)
    useEffect(() => {
        // Redirect jika page > MAX_PAGES
        if (currentPage > MAX_PAGES) {
            router.push(`/gallery/albums?page=${MAX_PAGES}`);
            return;
        }

        galleryService
            .getAlbums() // 🔥 Tidak kirim page/per_page
            .then((res) => {
                const data = res.data?.data || [];
                setAllAlbums(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching albums:", err);
                setError(err.response?.data?.message || "Gagal memuat album");
                setAllAlbums([]);
            })
            .finally(() => setLoading(false));
    }, [currentPage, router]);

    // 🔥 Client-side pagination: potong data berdasarkan halaman
    const paginatedAlbums = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return allAlbums.slice(start, end);
    }, [allAlbums, currentPage]);

    // 🔥 Total item dibatasi maksimal 12 (2 halaman × 6)
    const totalItems = Math.min(allAlbums.length, 12);
    const totalPages = Math.min(Math.ceil(allAlbums.length / ITEMS_PER_PAGE), MAX_PAGES);

    if (loading) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                    <BatikOverlay />
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-lg">Memuat album...</p>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                <BatikOverlay />
                <div className="max-w-306 mx-auto px-4 md:px-0 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 px-4 mt-16">
                        <div>
                            <Link 
                                href="/gallery" 
                                className="inline-flex items-center text-blue-600 hover:underline text-sm mb-2"
                            >
                                ← Kembali ke Galeri
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold font-young">
                                Album Galeri
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Kumpulan foto dan video dari setiap event
                            </p>
                        </div>
                        <span className="text-sm bg-primary-light px-3 py-1 rounded-full border border-neutral-normal">
                            {totalItems} album
                        </span>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mx-4 mb-6">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Album Grid */}
                    {paginatedAlbums.length === 0 && !error ? (
                        <div className="text-center py-16">
                            <p className="text-2xl text-neutral-dark">
                                Belum ada album galeri.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
                                {paginatedAlbums.map((album) => (
                                    <AlbumCard key={album.id} album={album} />
                                ))} 
                            </div>

                            {/* 🔥 Pagination - maksimal 2 halaman */}
                            {totalPages > 1 && (
                                <div className="mt-8 px-4">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}