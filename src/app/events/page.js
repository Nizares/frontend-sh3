"use client";
import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import EventCard from "@/src/components/EventCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import { RevealSection } from "@/src/components/RevealSection";
import { eventService } from "@/src/services/eventService";
import { categoryService } from "@/src/services/categoryService";
import BigEventCard from "@/src/components/BigEventCard";
import Pagination from "@/src/components/Pagination";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [majorPage, setMajorPage] = useState(1);
  const itemsPerPage = 6; // 3 kolom x 2 baris
  const majorItemsPerPage = 4; // 2 kolom x 2 baris
  const now = new Date();

  useEffect(() => {
    Promise.all([
      eventService.getAll({ per_page: 100 }),
      categoryService.getAll(),
    ])
      .then(([eventsRes, categoriesRes]) => {
        const data = eventsRes.data.data ?? [];
        setEvents(Array.isArray(data) ? data : []);
        setCategories(categoriesRes.data.data ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🔥 Reset ke halaman 1 saat tab atau kategori berubah
  useEffect(() => {
    setCurrentPage(1);
    setMajorPage(1);
  }, [activeTab, activeCategory]);

  // ====== FILTER EVENTS ======
  const upcomingEvents = events
    .filter((item) => new Date(item.start_date) > now)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const ongoingEvents = events
    .filter(
      (item) =>
        new Date(item.start_date) <= now && new Date(item.end_date) >= now,
    )
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const pastEvents = events
    .filter((item) => new Date(item.end_date) < now)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  // ====== GET EVENTS BERDASARKAN TAB ======
  const getEventsByTab = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingEvents;
      case "ongoing":
        return ongoingEvents;
      case "past":
        return pastEvents;
      default:
        return [];
    }
  };

  // ====== FILTER BERDASARKAN KATEGORI ======
  const filteredEvents = getEventsByTab().filter(
    (item) =>
      activeCategory === "all" || item.category?.name === activeCategory,
  );

  // 🔥 MAJOR EVENTS - TIDAK TERPENGARUH FILTER TAB & KATEGORI
  // Hanya tampil jika status publish atau ongoing (belum selesai)
  const allMajorEvents = events
    .filter(
      (item) =>
        item.category?.name === "Major Events" &&
        (item.status === "publish" || item.status === "ongoing")
    )
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  // ====== PAGINATION UNTUK MAJOR EVENTS ======
  const totalMajorPages = Math.ceil(allMajorEvents.length / majorItemsPerPage);
  const majorStartIndex = (majorPage - 1) * majorItemsPerPage;
  const paginatedMajorEvents = allMajorEvents.slice(majorStartIndex, majorStartIndex + majorItemsPerPage);

  // ====== EVENTS BIASA (NON-MAJOR) ======
  const regularEvents = filteredEvents.filter(
    (item) => item.category?.name !== "Major Events"
  );

  // ====== PAGINATION UNTUK REGULAR EVENTS ======
  const totalRegularPages = Math.ceil(regularEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegularEvents = regularEvents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMajorPageChange = (page) => {
    setMajorPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ====== RENDER EMPTY STATE ======
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "upcoming":
        return "Belum ada event yang akan datang.";
      case "ongoing":
        return "Belum ada event yang sedang berlangsung.";
      case "past":
        return "Belum ada event yang sudah selesai.";
      default:
        return "Belum ada event.";
    }
  };

  // ====== CEK APAKAH ADA MAJOR EVENTS ======
  const hasMajorEvents = allMajorEvents.length > 0;

  return (
    <Container className="flex flex-col w-full">
      <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light min-h-screen">
        <BatikOverlay />
        <div className="max-w-306 mx-auto px-4 md:px-0">
          <RevealSection direction="up">
            <div className="flex flex-col items-center justify-center pt-24 pb-8">
              <h1 className="text-5xl font-bold font-young">Events</h1>
            </div>
          </RevealSection>

          {/* 🔥 MAJOR EVENTS SECTION - TIDAK TERPENGARUH FILTER */}
          {hasMajorEvents && (
            <div className="flex flex-col mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-bold font-young text-center flex-1">
                  Major Events
                </h2>
                {totalMajorPages > 1 && (
                  <span className="text-sm text-neutral-dark">
                    Halaman {majorPage} dari {totalMajorPages}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedMajorEvents.map((item, i) => (
                  <RevealSection
                    key={i}
                    direction="up"
                    delay={i * 100}
                    className="flex justify-center w-full"
                  >
                    <BigEventCard
                      id={item.id}
                      title={item.title}
                      start_date={item.start_date}
                      end_date={item.end_date}
                      category={item.category?.name}
                      img={item.image_url}
                      status={item.status}
                    />
                  </RevealSection>
                ))}
              </div>

              {/* 🔥 PAGINATION MAJOR EVENTS */}
              {totalMajorPages > 1 && (
                <Pagination
                  currentPage={majorPage}
                  totalPages={totalMajorPages}
                  onPageChange={handleMajorPageChange}
                />
              )}
            </div>
          )}

          {/* ====== TAB FILTER ====== */}
          <div className="flex flex-row gap-4 border-b-2 border-neutral-normal mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`cursor-pointer pb-3 px-2 font-bold text-xl font-young transition-all whitespace-nowrap ${
                activeTab === "ongoing"
                  ? "text-secondary-bg border-b-4 border-secondary-bg"
                  : "text-neutral-dark hover:text-secondary-bg"
              }`}
            >
              Ongoing Events
              {ongoingEvents.length > 0 && (
                <span className="ml-1 text-sm bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  {ongoingEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`cursor-pointer pb-3 px-2 font-bold text-xl font-young transition-all whitespace-nowrap ${
                activeTab === "upcoming"
                  ? "text-secondary-bg border-b-4 border-secondary-bg"
                  : "text-neutral-dark hover:text-secondary-bg"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`cursor-pointer pb-3 px-2 font-bold text-xl font-young transition-all whitespace-nowrap ${
                activeTab === "past"
                  ? "text-secondary-bg border-b-4 border-secondary-bg"
                  : "text-neutral-dark hover:text-secondary-bg"
              }`}
            >
              Past Events
            </button>
          </div>

          {/* ====== FILTER KATEGORI ====== */}
          <div className="flex flex-row flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 font-medium font-young transition-all rounded-md border-2 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-secondary-bg text-white border-secondary-bg"
                  : "bg-transparent text-neutral-dark border-neutral-normal hover:border-emerald-600 hover:text-emerald-600"
              }`}
            >
              All Events
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-5 py-2 font-medium font-young transition-all rounded-md border-2 cursor-pointer ${
                  activeCategory === cat.name
                    ? "bg-secondary-bg text-white border-secondary-bg"
                    : "bg-transparent text-neutral-dark border-neutral-normal hover:border-emerald-600 hover:text-emerald-600"
                }`}
              >
                {cat.name}
                <span className="ml-1 text-xs opacity-60">
                  ({cat.events_count || 0})
                </span>
              </button>
            ))}
          </div>

          {/* ====== EVENTS GRID ====== */}
          {loading ? (
            <div className="flex justify-center py-16 text-xl">Loading...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex justify-center py-16 text-xl text-neutral-dark">
              {getEmptyMessage()}
            </div>
          ) : regularEvents.length === 0 ? (
            <div className="flex justify-center py-16 text-xl text-neutral-dark">
              {allMajorEvents.length > 0 
                ? "Tidak ada event reguler untuk kategori ini." 
                : getEmptyMessage()}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                {paginatedRegularEvents.map((item, i) => (
                  <RevealSection key={i} direction="up" delay={i * 50}>
                    <EventCard
                      id={item.id}
                      title={item.title}
                      start_date={item.start_date}
                      end_date={item.end_date}
                      category={item.category?.name}
                      description={item.description}
                      location={item.location}
                      img={item.image_url}
                      status={item.status}
                    />
                  </RevealSection>
                ))}
              </div>

              {/* 🔥 PAGINATION REGULAR EVENTS */}
              {totalRegularPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalRegularPages}
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