"use client"
import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import EventCard from "@/src/components/EventCard";
import { eventService } from "@/src/services/eventService";
import { RevealSection } from "@/src/components/RevealSection";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    eventService.getAll()
      .then(res => {
        const data = res.data.data ?? res.data ?? [];
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-16 text-2xl">Loading...</div>;
  return (
    <Container className="flex flex-col gap-y-8">
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <h1 className="text-text-colors text-5xl font-bold">Events</h1>
      </div>

      <h2 className="text-3xl font-bold flex justify-center">Event yang Akan Datang</h2>
      <div className="flex md:flex-row justify-center gap-8 flex-col items-center">

        {loading ? (
          <p className="text-xl">Loading...</p>
        ) : (
          events
            .filter((item) => new Date(item.start_date) > now)
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
            .slice(0, 3)
            .map((item, i) => (
              <RevealSection key={i} direction="up" delay={i * 100}>
                <EventCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  start_date={item.start_date}
                  end_date={item.end_date}
                  category={item.category?.name}
                  img={item.image_url}
                  status={item.status}
                />
              </RevealSection>
            ))
        )}
      </div>



      <h2 className="text-3xl font-bold flex justify-center">Event yang Sudah Selesai</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : (
            events
              .filter((item) => new Date(item.start_date) < now)
              .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
              .slice(0, 4)
              .map((item, i) => (
                <RevealSection key={i} direction="up" delay={i * 100}>
                  <EventCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    start_date={item.start_date}
                    end_date={item.end_date}
                    category={item.category?.name}
                    img={item.image_url}
                    status={item.status}
                  />
                </RevealSection>
              ))
          )}
        </div>
      </div>


    </Container>

  );
}
