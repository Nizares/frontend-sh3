"use client"
import { useState, useEffect } from "react";
import Container from "@/src/components/Container";
import EventCard from "@/src/components/EventCard";
import { eventService } from "@/src/services/eventService";

// const dummyEvents = [
//   {
//     id: 1,
//     title: "Borneo Nash Hash 2027",
//     start_date: "2027-10-23",
//     end_date: "2027-10-24",
//     category: "Long Run",
//     img: "/assets/images/poster2027.jpg",
//     status: "ongoing"
//   },
//   {
//     id: 2,
//     title: "Borneo Nash Hash 2027",
//     start_date: "2027-10-23",
//     end_date: "2027-10-24",
//     category: "Long Run",
//     img: "/assets/images/poster2027.jpg",
//     status: "ongoing"
//   },
//   {
//     id: 3,
//     title: "Ketupat Cap Go Meh Run 2026",
//     start_date: "2026-03-29",
//     end_date: "2026-03-30",
//     category: "Long Run",
//     img: "/assets/images/ketupat_banner.jpg",
//     status: "ended"
//   },
//   {
//     id: 4,
//     title: "Ketupat Cap Go Meh Run 2026",
//     start_date: "2026-03-29",
//     end_date: "2026-03-30",
//     category: "Long Run",
//     img: "/assets/images/ketupat_banner.jpg",
//     status: "ended"
//   },
//   {
//     id: 5,
//     title: "Ketupat Cap Go Meh Run 2026",
//     start_date: "2026-03-29",
//     end_date: "2026-03-30",
//     category: "Long Run",
//     img: "/assets/images/ketupat_banner.jpg",
//     status: "ended"
//   },
//   {
//     id: 6,
//     title: "Ketupat Cap Go Meh Run 2026",
//     start_date: "2026-03-29",
//     end_date: "2026-03-30",
//     category: "Long Run",
//     img: "/assets/images/ketupat_banner.jpg",
//     status: "ended"
//   },
// ]

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

        {events
          .filter(item => new Date(item.start_date) > now)
          .slice(0, 3)
          .map(item => (
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
          ))
        }
      </div>



      <h2 className="text-3xl font-bold flex justify-center">Event yang Sudah Selesai</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {events
            .filter(item => new Date(item.start_date) < now)
            .slice(0, 4)
            .map(item => (
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
            ))
          }
        </div>
      </div>


    </Container>

  );
}
