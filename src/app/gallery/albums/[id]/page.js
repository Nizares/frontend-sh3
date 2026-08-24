// src/app/gallery/albums/[id]/page.js
"use client";

import { useState, useEffect, use } from "react";
import Container from "@/src/components/Container";
import BatikOverlay from "@/src/components/BatikOverlay";
import { galleryService } from "@/src/services/galleryService";
import Link from "next/link";

export default function AlbumDetail({ params }) {
    const { id } = use(params);
    
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        
        galleryService
            .getAlbumDetail(id)
            .then((res) => {
                setAlbum(res.data?.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching album:", err);
                setError(err.response?.data?.message || "Gagal memuat album");
            })
            .finally(() => setLoading(false));
    }, [id]);

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

    if (error || !album) {
        return (
            <Container className="flex flex-col w-full">
                <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
                    <BatikOverlay />
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-center">
                            <p className="text-xl text-red-600">{error || "Album tidak ditemukan"}</p>
                            <Link href="/gallery" className="text-blue-600 hover:underline mt-4 inline-block">
                                ← Kembali ke Galeri
                            </Link>
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
                    {/* Back button */}
                    <Link 
                        href="/gallery" 
                        className="inline-flex items-center text-blue-600 hover:underline mb-6"
                    >
                        ← Kembali ke Galeri
                    </Link>

                    {/* Album Info */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h1 className="text-3xl font-bold">{album.title}</h1>
                        {album.description && (
                            <p className="text-gray-600 mt-2">{album.description}</p>
                        )}
                        {album.event && (
                            <p className="text-sm text-gray-400 mt-1">
                                Event: {album.event.title}
                            </p>
                        )}
                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                            <span className="text-sm text-gray-500">
                                {album.galleries_count || 0} media
                            </span>
                            {album.gdrive_folder_url && (
                                <a
                                    href={album.gdrive_folder_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4.59 6.89c.7-.71 1.4-1.42 2.11-2.12l2.12 2.12-2.12 2.12L4.59 6.89zm13.53 13.53l-2.12-2.12 2.12-2.12 2.12 2.12-2.12 2.12zM11.5 3.5h1v14h-1v-14zm-1 15h3v1h-3v-1z"/>
                                    </svg>
                                    Buka di Google Drive
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {album.galleries && album.galleries.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {album.galleries.map((media) => (
                                <div 
                                    key={media.id} 
                                    className="relative overflow-hidden rounded-lg shadow-md bg-white group"
                                >
                                    {media.type === "video" ? (
                                        <video
                                            src={media.url}
                                            controls
                                            className="w-full h-auto max-h-64 object-contain"
                                            poster={media.thumb || undefined}
                                        />
                                    ) : (
                                        <img
                                            src={media.url || media.thumb}
                                            alt={media.title || "Media"}
                                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                // ✅ PERBAIKAN: path relatif dari public
                                                e.target.src = "/assets/images/placeholder.png";
                                            }}
                                        />
                                    )}
                                    {media.external_url && (
                                        <a
                                            href={media.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded hover:bg-black/70 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Drive
                                        </a>
                                    )}
                                    {media.title && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs truncate">{media.title}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500">Belum ada media dalam album ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}