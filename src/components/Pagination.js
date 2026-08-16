// src/components/Pagination.jsx
"use client";

import { useState, useEffect } from "react";

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    className = "" 
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (totalPages <= 1) return null;

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // 🔥 Responsive: tampilkan lebih sedikit tombol di mobile
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = isMobile ? 3 : 5; // Mobile: 3, Desktop: 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // Selalu tampilkan halaman pertama
        pages.push(1);

        // Hitung range halaman di sekitar currentPage
        let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages - 1, currentPage + Math.floor(maxVisible / 2));

        // Sesuaikan jika di ujung
        if (currentPage <= maxVisible) {
            end = Math.min(totalPages - 1, maxVisible);
        }
        if (currentPage > totalPages - maxVisible) {
            start = Math.max(2, totalPages - maxVisible + 1);
        }

        // Tambahkan ellipsis di awal jika perlu
        if (start > 2) {
            pages.push("...");
        }

        // Tambahkan halaman di range
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Tambahkan ellipsis di akhir jika perlu
        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Selalu tampilkan halaman terakhir
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-4 pb-8 ${className}`}>
            {/* Prev Button */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-sm transition-colors ${
                    currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-light hover:bg-primary-light-active text-neutral-dark"
                }`}
            >
                {isMobile ? "‹" : "← Prev"}
            </button>

            {/* Page Numbers */}
            <div className="flex flex-wrap justify-center gap-1 sm:gap-1">
                {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                        <span 
                            key={`ellipsis-${idx}`} 
                            className="w-7 sm:w-10 h-7 sm:h-10 flex items-center justify-center text-xs sm:text-sm text-neutral-400 select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-7 sm:w-10 h-7 sm:h-10 rounded-md font-medium text-xs sm:text-sm transition-colors ${
                                currentPage === page
                                    ? "bg-secondary-bg text-white"
                                    : "bg-primary-light hover:bg-primary-light-active text-neutral-dark"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next Button */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-sm transition-colors ${
                    currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-light hover:bg-primary-light-active text-neutral-dark"
                }`}
            >
                {isMobile ? "›" : "Next →"}
            </button>
        </div>
    );
}