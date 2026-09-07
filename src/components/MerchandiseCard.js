// src/components/MerchandiseCard.jsx
import Link from "next/link";
import { formatRupiah } from "@/src/lib/utils";

export default function MerchandiseCard({
    id,
    name,
    price,
    image_url,
    stock,
    sizes,
    points_required = 0,
    isPointRedeemable = false,
    price_after_points = null,
}) {
    const isRedeemable = isPointRedeemable && points_required > 0;

    return (
        <div className="flex flex-col h-full bg-white border-2 border-neutral-normal hover:border-secondary-bg transition-colors rounded-md shadow-sm hover:shadow-md">
            {/* Gambar */}
            <div className="relative w-full h-62.5 overflow-hidden bg-neutral-bg rounded-t-md">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/assets/images/placeholder.png";
                        }}
                    />
                ) : (
                    <img
                        src="/assets/images/placeholder.png"
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Badge Stok Menipis */}
                {stock <= 10 && stock > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        Sisa {stock}
                    </div>
                )}

                {/* Badge Stok Habis */}
                {stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Habis</span>
                    </div>
                )}

                {/* 🔥 Badge "Tukar Poin" */}
                {isRedeemable && stock > 0 && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                        {points_required} Poin
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 flex-1">
                <div className="flex flex-col gap-1 flex-1">
                    <div className="font-semibold text-sm line-clamp-2 group-hover:text-secondary-bg transition-colors">
                        {name}
                    </div>

                    {/* 🔥 Harga */}
                    {isRedeemable && price_after_points !== null && price_after_points < price ? (
                        <div className="flex flex-col">
                            <div className="text-xs text-neutral-dark line-through">
                                Rp. {formatRupiah(price)}
                            </div>
                            <div className="font-bold text-secondary-bg">
                                Rp. {formatRupiah(price_after_points)}
                                <span className="text-xs text-neutral-dark font-normal ml-1">
                                    (dengan poin)
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="font-bold text-secondary-bg">
                            Rp. {formatRupiah(price)}
                        </div>
                    )}

                    {/* Size */}
                    {sizes?.length > 0 && (
                        <div className="text-xs text-neutral-dark">
                            Size: {sizes.join(", ")}
                        </div>
                    )}

                    {/* 🔥 Info Poin */}
                    {isRedeemable && stock > 0 && (
                        <div className="mt-1 text-xs text-amber-600 font-medium">
                            🎯 Tukar dengan {points_required} poin
                        </div>
                    )}
                </div>

                {/* Button */}
                <Link
                    href={`/merchandise/order?id=${id}`}
                    className={`mt-2 text-white text-center px-5 py-2.5 text-sm font-medium transition-colors font-young shadow-md rounded-md
                        ${
                            stock === 0
                                ? "bg-neutral-normal pointer-events-none opacity-60"
                                : "bg-primary-bg hover:bg-primary-bg-hover active:bg-primary-bg-active"
                        }`}
                >
                    {stock === 0 ? "Habis" : isRedeemable ? "Pesan dengan Poin" : "Pesan"}
                </Link>
            </div>
        </div>
    );
}