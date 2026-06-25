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

  if (loading) return <div className="flex justify-center p-16 text-2xl h-screen mt-24">Loading...</div>;
  return (
    <Container className="flex flex-col relative bg-linear-to-b from-primary-light to-primary-light-hover">
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
      <div className="flex flex-col flex-1 max-w-306 mx-auto mb-8">
        <div className="flex flex-col flex-1 items-center justify-center p-8 mt-16">
          <h1 className="text-text-colors text-5xl font-bold font-young text-primary-dark-active ">Events</h1>
        </div>

        <h2
          className="text-4xl font-bold justify-center font-young text-primary-dark-active my-16 relative w-3/4 mx-auto text-center"
          id="upcomingRun"
        >
          Event yang Akan Datang
        </h2>
        <div className="flex md:flex-row justify-between gap-8 flex-col">
          {loading ? (
            <p className="text-xl w-full text-center">Loading...</p>
          ) : (
            (() => {
              const upcomingEvents = events
                .filter((item) => new Date(item.start_date) > now)
                .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                .slice(0, 4);

              return upcomingEvents.length === 0 ? (
                <p className="text-xl text-neutral-dark py-12 w-full text-center">
                  Belum ada event yang akan datang. Pantau terus ya!
                </p>
              ) : (
                upcomingEvents.map((item, i) => (
                  <RevealSection
                    key={i}
                    direction="up"
                    delay={i * 100}
                    className="flex-1"
                  >
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
              );
            })()
          )}
        </div>




        <h2 className="text-4xl font-bold font-young text-primary-dark-active my-16 relative w-3/4 mx-auto text-center">
          Event yang Sudah Selesai
        </h2>
        <div className="flex md:flex-row justify-between gap-8 flex-col">
          {loading ? (
            <p className="text-xl w-full text-center">Loading...</p>
          ) : (
            (() => {
              const upcomingEvents = events
                .filter((item) => new Date(item.start_date) < now)
                .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                .slice(0, 4);

              return upcomingEvents.length === 0 ? (
                <p className="text-xl text-center text-neutral-dark py-12 w-full ">
                  Belum ada event. Pantau terus ya!
                </p>
              ) : (
                upcomingEvents.map((item, i) => (
                  <RevealSection
                    key={i}
                    direction="up"
                    delay={i * 100}
                    className="flex-1"
                  >
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
              );
            })()
          )}
        </div>

      </div>
    </Container>

  );
}
