"use client"
import { useState, useEffect } from "react";

import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, CalendarDaysIcon, UserGroupIcon, TagIcon } from "@heroicons/react/24/solid";
import { concateDate, formatRupiah } from "@/src/lib/utils";
import { eventService } from "@/src/services/eventService";
import { RevealSection } from "@/src/components/RevealSection";
import SponsorSection from "@/src/components/SponsorSection";
import EventGallery from "@/src/components/EventGallery";
import Pagination from "@/src/components/Pagination";

export default function PastEvents() {
  const [event, setEvent] = useState(null);

  // 🔥 Pagination untuk gallery
  const [galleryPage, setGalleryPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id") ?? 1;

    eventService
      .getById(eventId)
      .then((res) => setEvent(res.data.data))
      .catch(console.error);
  }, []);

  // 🔥 Cek apakah address adalah link/iframe
  const isAddressLink = (address) => {
    if (!address) return false;
    return address.startsWith('http') ||
      address.includes('google.com/maps') ||
      address.includes('iframe') ||
      address.includes('embed');
  };

  // 🔥 Extract embed URL dari address jika berupa iframe HTML
  const extractEmbedUrl = (address) => {
    if (!address) return null;

    if (address.startsWith('http')) {
      return address;
    }

    const srcMatch = address.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      return srcMatch[1];
    }

    return null;
  };

  // 🔥 Format maps link untuk tombol
  const getMapsLinkFromAddress = (address) => {
    if (!address) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // 🔥 Format tanggal dengan end date
  const formatEventDate = () => {
    if (!event) return "";

    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const startDate = start.toLocaleDateString('id-ID', options);
    const startTime = start.toLocaleTimeString('id-ID', timeOptions);
    const endDate = end.toLocaleDateString('id-ID', options);
    const endTime = end.toLocaleTimeString('id-ID', timeOptions);

    if (startDate === endDate) {
      return `${startDate} · ${startTime} - ${endTime} WITA`;
    }

    return `${startDate} ${startTime} - ${endDate} ${endTime} WITA`;
  };

  // 🔥 Gallery pagination handler
  const handleGalleryPageChange = (page) => {
    setGalleryPage(page);
  };

  if (!event) return <div className="flex justify-center p-16 text-2xl mt-16 h-screen">Loading...</div>;

  const bannerImage = event.banner_url || event.image_url || "/assets/images/placeholder-event.jpg";
  const detailImage = event.image_url || event.banner_url || "/assets/images/placeholder-event.jpg";
  const hasDetailImage = detailImage && detailImage !== "/assets/images/placeholder-event.jpg";

  const addressIsLink = isAddressLink(event.address);
  const embedUrl = extractEmbedUrl(event.address);

  // 🔥 Gallery data
  const galleries = event.galleries || [];
  const totalGalleryPages = Math.ceil(galleries.length / itemsPerPage);
  const startIndex = (galleryPage - 1) * itemsPerPage;
  const paginatedGalleries = galleries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container className="flex flex-col gap-y-4 w-full">
      <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
        {/* Batik Decoration */}
        <div
          className="absolute top-0 left-0 h-full w-28 bg-repeat-y bg-left mask-r-from-5%"
          style={{
            backgroundImage: `url('/assets/images/batik4.svg')`,
            backgroundSize: "112px",
          }}
        />
        <div
          className="absolute top-0 right-0 h-full w-28 bg-repeat-y bg-left -scale-x-100 mask-r-from-5%"
          style={{
            backgroundImage: `url('/assets/images/batik4.svg')`,
            backgroundSize: "112px",
          }}
        />

        <div className="max-w-306 mx-auto px-4 md:px-0 relative z-1">
          {/* Back Button & Title */}
          <div className="mt-24">
            <Link href="/events" className="static md:absolute">
              <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
            </Link>
            <div className="flex items-center justify-center w-full">
              <h1 className="text-4xl font-bold">{event.title}</h1>
            </div>
          </div>

          {/* 🔥 Location & Date - 2 Kolom SAMA UKURAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Kolom Kiri - Lokasi */}
            <div className="flex flex-col p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
              <div className="flex flex-row items-start gap-x-3">
                <MapPinIcon className="w-6 h-6 text-secondary-bg flex-shrink-0 mt-0.5" />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold">{event.location}</span>
                  {event.address && !addressIsLink && (
                    <span className="text-xs text-neutral-dark line-clamp-2">
                      {event.address}
                    </span>
                  )}
                </div>
              </div>

              {/* 🔥 Iframe Maps */}
              {addressIsLink && embedUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-neutral-normal/50 w-full">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="256"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* 🔥 Kolom Kanan - Tanggal & Waktu + Detail Image (Titik Kumpul) */}
            <div className="flex flex-col p-3 bg-primary-light/50 rounded-lg border border-neutral-normal/50">
              <div className="flex flex-row items-start gap-x-3">
                <CalendarDaysIcon className="w-6 h-6 text-secondary-bg flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Tanggal & Waktu</span>
                  <span className="text-sm text-neutral-dark">
                    {formatEventDate()}
                  </span>
                  {event.start_date && event.end_date && (
                    <span className="text-xs text-neutral-dark/60 mt-0.5">
                      {new Date(event.start_date).toLocaleDateString('id-ID', { weekday: 'long' })}
                      {new Date(event.start_date).toLocaleDateString('id-ID', { weekday: 'long' }) !==
                        new Date(event.end_date).toLocaleDateString('id-ID', { weekday: 'long' }) &&
                        ` - ${new Date(event.end_date).toLocaleDateString('id-ID', { weekday: 'long' })}`}
                    </span>
                  )}
                </div>
              </div>

              {/* 🔥 Detail Image - Meeting Point / Titik Kumpul */}
              {hasDetailImage && (
                <div className="mt-3 rounded-lg overflow-hidden border border-neutral-normal/50 w-full">
                  <div className="relative w-full h-64">
                    <img
                      src={detailImage}
                      alt="Titik Kumpul"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/assets/images/placeholder-event.jpg";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 Banner Image */}
          <div className="relative w-full h-64 md:h-80 mt-4 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={bannerImage}
              alt={`${event.title} - Banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/images/placeholder-event.jpg";
              }}
            />
          </div>

          {/* 🔥 Title & Category */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-sm text-neutral-dark">{event.category?.name || "Event"}</p>
          </div>

          {/* Description */}
          <RevealSection direction="up" delay="100">
            <div className="flex flex-col gap-x-16 my-4">
              <h2 className="text-2xl font-bold py-4 font-young">Tentang Event</h2>
              <div className="text-sm text-justify">{event.description}</div>
            </div>
          </RevealSection>

          {/* Stats */}
          <RevealSection direction="up" delay="100">
            <div className="flex flex-col w-full justify-center items-center gap-8 md:gap-32 md:flex-row bg-emerald-600 p-8 text-white font-young rounded-lg my-4">
              <div className="flex flex-row items-center justify-center gap-8">
                <UserGroupIcon className="w-16 h-16 md:w-32 md:h-32" />
                <div className="flex flex-col">
                  <div className="font-bold text-4xl">Joined</div>
                  <div className="font-semibold text-3xl">{event.registered_count || 0} Members</div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-8">
                <TagIcon className="w-16 h-16 md:w-32 md:h-32" />
                <div className="flex flex-col">
                  <div className="font-bold text-4xl">Category</div>
                  <div className="font-semibold text-3xl">{event.category?.name || "-"}</div>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* 🔥 Gallery Section with Pagination Component */}
          {galleries.length > 0 && (
            <RevealSection direction="up" delay="100">
              <div className="my-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold font-young">Galeri Event</h2>
                  {totalGalleryPages > 1 && (
                    <span className="text-sm text-neutral-dark">
                      Halaman {galleryPage} dari {totalGalleryPages}
                    </span>
                  )}
                </div>
                
                <EventGallery images={paginatedGalleries} />

                {/* 🔥 PAKAI KOMPONEN PAGINATION */}
                <Pagination 
                  currentPage={galleryPage}
                  totalPages={totalGalleryPages}
                  onPageChange={handleGalleryPageChange}
                />
              </div>
            </RevealSection>
          )}

          {/* Sponsors */}
          {event.sponsors && (
            <RevealSection direction="up" delay="100">
              <div className="w-full py-4">
                <SponsorSection sponsors={event.sponsors} />
              </div>
            </RevealSection>
          )}
        </div>
      </div>
    </Container>
  );
}