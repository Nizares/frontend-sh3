// 🔥 Komponen Gallery Card (existing, sedikit dimodifikasi)
import Link from "next/link";
export default function GalleryCard({ image }) {
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