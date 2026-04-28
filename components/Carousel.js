// components/Carousel.js
"use client"

import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

const events = [
  {
    id: 1,
    image: "/assets/images/ketupat_banner.jpg",
    title: "Grand Party Run 2026",
    location: "Samarinda, 26 Oct 2025",
    type: "Long Run",
    peserta: "200+",
  },
  {
    id: 2,
    image: "/assets/images/ketupat_banner.jpg",
    title: "Hash Run #123",
    location: "Samarinda, 10 Nov 2025",
    type: "Short Run",
    peserta: "150+",
  },
  {
    id: 3,
    image: "/assets/images/ketupat_banner.jpg",
    title: "Anniversary Run",
    location: "Samarinda, 20 Des 2025",
    type: "Fun Run",
    peserta: "300+",
  },
]

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  // update index saat slide berubah
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="bg-bg-colors py-16">

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {events.map((event, index) => {
            const isActive = index === selectedIndex
            return (
              <div
                key={event.id}
                className={`relative flex-none mx-3 transition-all duration-500 rounded-2xl overflow-hidden
                  ${isActive
                    ? "w-[55%] md:w-[45%] scale-100 shadow-2xl z-10"   // card aktif — besar
                    : "w-[35%] md:w-[28%] scale-90 opacity-60"          // card lain — kecil & redup
                  }
                `}
              >
                {/* Gambar */}
                <div className="relative h-56 md:h-96">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay gelap */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Teks di atas gambar — hanya muncul di card aktif */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{event.location}</p>
                      <div className="flex items-end justify-between">
                        <span className="font-semibold">{event.type}</span>
                        <span className="font-semibold text-right">
                          {event.peserta}<br />Peserta
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dot indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-[#2D6A4F] w-6"   // dot aktif — lebih panjang
                : "bg-gray-400"         // dot tidak aktif
            }`}
          />
        ))}
      </div>

    </div>
  )
}