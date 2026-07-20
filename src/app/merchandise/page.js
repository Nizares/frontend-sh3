// src/app/merchandise/page.jsx
"use client"
import { useState, useEffect } from "react"
import Container from "@/src/components/Container"
import { RevealSection } from "@/src/components/RevealSection"
import { merchandiseService } from "@/src/services/merchandiseService"
import MerchandiseCard from "@/src/components/MerchandiseCard"
import BatikOverlay from "@/src/components/BatikOverlay"

export default function MerchandisePage() {
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        merchandiseService.getCategories()
            .then(res => setCategories(res.data.data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        setLoading(true)
        const params = {}
        if (selectedCategory) params.category = selectedCategory

        merchandiseService.getAll(params)
            .then(res => setItems(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [selectedCategory])

    return (
        <Container className="flex flex-col gap-y-8 w-full">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
                <BatikOverlay />
                <div className="max-w-306 mx-auto w-full p-4 md:p-0">
                    <RevealSection direction="up">
                        <div className="mt-8">
                            <h1 className="text-5xl font-bold font-young text-center text-primary-darker mt-24">Merchandise</h1>
                            <p className="text-center text-neutral-dark mt-2">Dapatkan merchandise resmi Samarinda Hash House Harriers</p>
                        </div>
                    </RevealSection>

                    {/* Filter Kategori */}
                    <RevealSection direction="up" delay="100">
                        <div className="flex flex-wrap gap-2 mt-8">
                            <button
                                onClick={() => setSelectedCategory("")}
                                className={`px-4 py-2 font-medium transition-colors border-2 rounded-md cursor-pointer ${selectedCategory === ""
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-transparent text-neutral-dark border-neutral-normal hover:border-emerald-600 hover:text-emerald-600"
                                    }`}
                            >
                                Semua
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 font-medium transition-colors border-2 rounded-md cursor-pointer ${selectedCategory === cat.id
                                        ? "bg-secondary-bg text-white border-secondary-bg"
                                        : "bg-transparent text-neutral-dark border-neutral-normal hover:border-emerald-600 hover:text-emerald-600"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </RevealSection>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex justify-center p-16 text-2xl h-screen">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="flex justify-center p-16 text-xl text-neutral-dark h-screen">
                            Belum ada merchandise tersedia.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
                            {items.map(item => (
                                <RevealSection key={item.id} direction="up" delay="100">
                                    <MerchandiseCard
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        image_url={item.image_url}
                                        stock={item.stock}
                                        sizes={item.sizes}
                                    />
                                </RevealSection>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}