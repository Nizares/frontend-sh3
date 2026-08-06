"use client"

import Link from "next/link"
import { useState } from "react"
import { RevealSection } from "@/src/components/RevealSection"

const ITEMS_PER_PAGE = 8
const ITEMS_PER_SECTION = 4

export default function MasonryGallery({ images = [] }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedImages = images.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const sections = []
  for (let i = 0; i < paginatedImages.length; i += ITEMS_PER_SECTION) {
    sections.push(paginatedImages.slice(i, i + ITEMS_PER_SECTION))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-4 md:p-4 min-h-screen">
      {sections.map((section, sectionIdx) => (
        <RevealSection key={`${currentPage}-${sectionIdx}`} direction="up" delay={sectionIdx * 100}>
          <Section images={section} sectionIndex={sectionIdx} />
        </RevealSection>
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)
    if (currentPage > 3) pages.push("...")

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-primary-light active:bg-primary-light"
      >
        Prev
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-neutral-400 select-none">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 text-sm font-medium transition-colors 
              ${currentPage === page
                ? "bg-primary text-neutral-dark shadow-sm border-2 border-neutral-normal"
                : "hover:bg-neutral-bg-active active:bg-neutral-200 text-neutral-lighter"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-primary-light active:bg-primary-light"
      >
        Next
      </button>
    </div>
  )
}

// 🔥 ImageCard dengan LINK LOGIC
function ImageCard({ img, className }) {
  // 🔥 Skip jika img tidak valid
  if (!img || !img.url || img.url === null || img.url === "") {
    return null;
  }

  // 🔥 LOGIC LINK berdasarkan status
  let link = "#";
  if (img.event_id) {
    if (img.status === "ongoing" || img.status === "upcoming") {
      link = `/events/upcoming?id=${img.event_id}`;
    } else {
      link = `/events/finished?id=${img.event_id}`;
    }
  }

  return (
    <Link
      href={link}
      className={`relative overflow-hidden group cursor-pointer ${className} ${
        !img.event_id ? "pointer-events-none" : ""
      }`}
      onClick={(e) => {
        if (!img.event_id) {
          e.preventDefault();
        }
      }}
    >
      <img
        src={img.url}
        alt={img?.title || "Gallery image"}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <Caption title={img?.title} subtitle={img?.subtitle} />
      
      {/* 🔥 Badge status (opsional) */}
      {img.status && img.event_id && (
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
          img.status === "ongoing" ? "bg-green-500" :
          img.status === "upcoming" ? "bg-blue-500" :
          img.status === "completed" ? "bg-purple-500" :
          img.status === "cancelled" ? "bg-red-500" :
          "bg-gray-500"
        }`}>
          {img.status === "ongoing" ? "Berlangsung" :
           img.status === "upcoming" ? "Akan Datang" :
           img.status === "completed" ? "Selesai" :
           img.status === "cancelled" ? "Dibatalkan" :
           img.status}
        </div>
      )}
      
      {/* 🔥 Featured badge */}
      {img.is_featured && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-black">
          Featured
        </div>
      )}
    </Link>
  )
}

function Section({ images, sectionIndex }) {
  const isEven = sectionIndex % 2 === 0

  // Filter null/undefined images
  const validImages = images.filter(Boolean)

  if (validImages.length === 0) return null

  if (isEven) {
    return (
      <>
        {/* Mobile: stack vertikal */}
        <div className="flex flex-col gap-4 md:hidden">
          {validImages.map((img, i) => (
            <ImageCard key={i} img={img} className="h-48" />
          ))}
        </div>

        {/* Desktop: layout masonry */}
        <div className="hidden md:flex gap-4 h-72">
          <ImageCard img={validImages[0]} className="w-1/3 shrink-0" />
          <div className="flex flex-col flex-1 gap-4">
            <ImageCard img={validImages[1]} className="flex-1" />
            {validImages.slice(2, 4).length > 0 && (
              <div className="flex gap-4 h-32">
                {validImages.slice(2, 4).map((img, i) => (
                  <ImageCard key={i} img={img} className="flex-1" />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  const hasRightImage = validImages[3] != null

  return (
    <>
      {/* Mobile: stack vertikal */}
      <div className="flex flex-col gap-4 md:hidden">
        {validImages.map((img, i) => (
          <ImageCard key={i} img={img} className="h-48" />
        ))}
      </div>

      {/* Desktop: layout masonry */}
      <div className="hidden md:flex gap-4 h-72">
        <div className={`flex flex-col gap-4 ${hasRightImage ? "flex-1" : "w-full"}`}>
          <ImageCard img={validImages[0]} className="flex-1" />
          {validImages.slice(1, 3).length > 0 && (
            <div className="flex gap-4 h-32">
              {validImages.slice(1, 3).map((img, i) => (
                <ImageCard key={i} img={img} className="flex-1" />
              ))}
            </div>
          )}
        </div>
        {hasRightImage && (
          <ImageCard img={validImages[3]} className="w-1/3 shrink-0" />
        )}
      </div>
    </>
  )
}

function Caption({ title, subtitle }) {
  if (!title) return null
  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/60 to-transparent rounded-md">
      <p className="text-white text-sm font-semibold leading-tight">{title}</p>
      {subtitle && <p className="text-neutral-bg text-xs">{subtitle}</p>}
    </div>
  )
}