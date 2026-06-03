"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Container from "@/src/components/Container"
import { RevealSection } from "@/src/components/RevealSection"
import { merchandiseService } from "@/src/services/merchandiseService"
import { formatRupiah } from "@/src/lib/utils"

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

    
    console.log(items)

    return (
        <Container className="flex flex-col gap-y-8 w-full">
            <div className="max-w-306 mx-auto w-full">
                <RevealSection direction="up">
                    <div className="mt-8">
                        <h1 className="text-5xl font-bold font-young text-center text-neutral-normal">Merchandise</h1>
                        <p className="text-center text-neutral-dark mt-2">Dapatkan merchandise resmi Samarinda Hash House Harriers</p>
                    </div>
                </RevealSection>

                {/* Filter Kategori */}
                <RevealSection direction="up" delay="100">
                    <div className="flex flex-wrap gap-2 mt-8">
                        <button
                            onClick={() => setSelectedCategory("")}
                            className={`px-4 py-2 font-medium transition-colors border-2 ${selectedCategory === ""
                                ? "bg-secondary-bg text-white border-secondary-bg"
                                : "bg-transparent text-neutral-dark border-neutral-normal hover:border-secondary-bg"
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 font-medium transition-colors border-2 ${selectedCategory === cat.id
                                    ? "bg-secondary-bg text-white border-secondary-bg"
                                    : "bg-transparent text-neutral-dark border-neutral-normal hover:border-secondary-bg"
                                    }`}
                            >
                              {cat.name}
                            </button>
                        ))}
                    </div>
                </RevealSection>

                {/* Grid Merchandise */}
                {loading ? (
                    <div className="flex justify-center p-16 text-2xl">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="flex justify-center p-16 text-xl text-neutral-dark">
                        Belum ada merchandise tersedia.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                        {items.map(item => (
                            <RevealSection key={item.id} direction="up" delay="100">
                                <Link href={`/merchandise/order?id=${item.id}`}>
                                    <div className="flex flex-col bg-primary-light border-2 border-neutral-normal hover:border-secondary-bg transition-colors cursor-pointer">
                                        {/* Gambar */}
                                        <div className="relative w-full aspect-square overflow-hidden bg-neutral-bg">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-dark text-4xl font-bold font-young">
                                                    {item.name.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            {/* Badge stok */}
                                            {item.stock <= 10 && item.stock > 0 && (
                                                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1">
                                                    Sisa {item.stock}
                                                </div>
                                            )}
                                            {item.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">Habis</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-3 flex flex-col gap-1">
                                            <div className="font-semibold text-sm line-clamp-2">{item.name}</div>
                                            <div className="font-bold text-secondary-bg">
                                                Rp. {formatRupiah(item.price)}
                                            </div>
                                            {item.sizes?.length > 0 && (
                                                <div className="text-xs text-neutral-dark">
                                                    Size: {item.sizes.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </RevealSection>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    )
}