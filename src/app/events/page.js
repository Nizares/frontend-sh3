"use client"
import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import EventCard from "@/src/components/EventCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import { RevealSection } from "@/src/components/RevealSection";
import { eventService } from "@/src/services/eventService";

export default function Events() {

  const categories = ["all", "Big Events", "Short Run", "Medium Run", "Long Run"];
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // ← filter tab
  const [activeCategory, setActiveCategory] = useState("all"); // ← tambah ini
  const now = new Date();

  useEffect(() => {
    eventService.getAll({ per_page: 100 })
      .then(res => {
        const data = res.data.data ?? res.data ?? [];
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = events.filter(item =>
    new Date(item.start_date) > now || (new Date(item.start_date) <= now && new Date(item.end_date) >= now)
  ).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const pastEvents = events.filter(item =>
    new Date(item.end_date) < now
  ).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  const displayedEvents = (activeTab === "upcoming" ? upcomingEvents : pastEvents)
    .filter(item => activeCategory === "all" || item.category?.name === activeCategory);

  return (
    <Container className="flex flex-col w-full">
      <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover min-h-screen">
        <BatikOverlay />
        <div className="max-w-306 mx-auto px-4 md:px-0">

          {/* Header */}
          <RevealSection direction="up">
            <div className="flex flex-col items-center justify-center pt-24 pb-8">
              <h1 className="text-5xl font-bold font-young text-primary-dark-active">Events</h1>
            </div>
          </RevealSection>

          {/* Tab Filter */}
          {/* Tab Filter */}
          <div className="flex flex-row gap-4 border-b-2 border-neutral-normal mb-4">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 px-2 font-bold text-xl font-young transition-all ${activeTab === "upcoming"
                  ? "text-secondary-bg border-b-4 border-secondary-bg"
                  : "text-neutral-dark hover:text-secondary-bg"
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`pb-3 px-2 font-bold text-xl font-young transition-all ${activeTab === "past"
                  ? "text-secondary-bg border-b-4 border-secondary-bg"
                  : "text-neutral-dark hover:text-secondary-bg"
                }`}
            >
              Past Events
            </button>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-row flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 font-medium font-young transition-all rounded-full border-2 ${activeCategory === cat
                    ? "bg-secondary-bg text-white border-secondary-bg"
                    : "bg-transparent text-neutral-dark border-neutral-normal hover:border-secondary-bg hover:text-secondary-bg"
                  }`}
              >
                {cat === "all" ? "All Events" : cat}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center py-16 text-xl">Loading...</div>
          ) : displayedEvents.length === 0 ? (
            <div className="flex justify-center py-16 text-xl text-neutral-dark">
              {activeTab === "upcoming"
                ? "Belum ada event yang akan datang."
                : "Belum ada event yang sudah selesai."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 pb-16">
              {displayedEvents.map((item, i) => (
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
          )}
        </div>
      </div>
    </Container>
  );
}