"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Container from "@/src/components/Container";
import Carousel from "@/src/components/Carousel";
import EventCard from "@/src/components/EventCard";
import { eventService } from "@/src/services/eventService";

export default function Home() {
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

  return (
    <Container className="flex flex-col gap-y-16">

      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <h1 className="text-5xl font-bold">Samarinda Hash House Harriers</h1>
        <h2 className="text-3xl font-semibold">On On!</h2>
        <p className="p-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec rhoncus est leo, quis dignissim felis ornare quis.
        </p>
        <Image
          src="/assets/images/sh3logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="w-40 h-40 md:w-64 md:h-64 lg:w-64 lg:h-64 object-cover rounded-lg"
        />
        <Link
          href="/about"
          className="bg-btn-green-normal text-white px-6 py-2.5 m-5 rounded-full font-medium hover:bg-btn-green-hover active:bg-btn-green-active transition-colors"
        >
          Tentang Kami
        </Link>
      </div>

      <Carousel />

      <h2 className="text-5xl font-bold flex justify-center">Event yang Akan Datang</h2>
      <div className="flex md:flex-row justify-center gap-8 flex-col items-center">
        {loading ? (
          <p className="text-xl">Loading...</p>
        ) : (
          events
            .filter(item => new Date(item.start_date) > now)
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
        )}
      </div>

      <h2 className="text-5xl font-bold flex justify-center">Event yang Sudah Selesai</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : (
            events
              .filter(item => new Date(item.start_date) < now)
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
          )}
        </div>
      </div>

    </Container>
  );
}