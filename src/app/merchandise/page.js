// src/app/merchandise/page.js
"use client";

import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import { merchandiseService } from "@/src/services/merchandiseService";
import MerchandiseCard from "@/src/components/MerchandiseCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import Pagination from "@/src/components/Pagination";

export default function MerchandisePage() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        merchandiseService
            .getAll()
            .then((res) => setCategories(res.data.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.category = selectedCategory;

        merchandiseService
            .getAll(params)
            .then((res) => {
                const data = res.data.data || [];
                setItems(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedCategory]);

    // Reset ke halaman 1 saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // Pagination logic
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Container className="flex flex-col gap-y-8 w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
                <BatikOverlay />
                <div className="max-w-306 mx-auto w-full p-4 md:p-0">
                    <RevealSection direction="up">
                        <div className="mt-8">
                            <h1 className="text-5xl font-bold font-young text-center text-primary-darker mt-24">
                                Merchandise
                            </h1>
                            <p className="text-center text-neutral-dark mt-2">
                                Dapatkan merchandise resmi Samarinda Hash House Harriers
                            </p>
                        </div>
                    </RevealSection>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex justify-center p-16 text-2xl min-h-screen">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="flex justify-center p-16 text-xl text-neutral-dark min-h-screen">
                            Belum ada merchandise tersedia.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
                                {paginatedItems.map((item) => (
                                    <RevealSection key={item.id} direction="up" delay="100">
                                        <MerchandiseCard
                                            id={item.id}
                                            name={item.name}
                                            price={item.price}
                                            image_url={item.image_url}
                                            stock={item.stock}
                                            sizes={item.sizes}
                                            points_required={item.points_required}
                                            isPointRedeemable={item.isPointRedeemable}
                                            price_after_points={item.price_after_points}
                                        />
                                    </RevealSection>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}