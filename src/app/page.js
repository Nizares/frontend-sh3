"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Container from "@/src/components/Container";
import Carousel from "@/src/components/Carousel";
import EventCard from "@/src/components/EventCard";
import TotalStatistic from "../components/TotalStatistics";
import LinkButton from "../components/LinkButton";
import { eventService } from "@/src/services/eventService";

import { RevealSection } from "../components/RevealSection";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    eventService
      .getAll()
      .then((res) => {
        const data = res.data.data ?? res.data ?? [];
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="flex flex-col">
      <RevealSection direction="up">

        <div className="flex flex-col flex-1 items-center justify-center pt-8 md:pt-0 p-8 max-w-306 mx-auto min-h-[80vh] overflow-hidden ">
          {/* <div className="absolute inset-0 bg-[url('/assets/images/batik1.jpg')] bg-repeat bg-size-[100px] opacity-15 -z-10" /> */}
          <Image
            src="/assets/images/hero1.jpg"
            alt="Hero background"
            fill // 2. Forces image to expand to the parent size
            priority // 3. Preloads the image if it's above the fold
            sizes="100vh" // 4. Tells Next.js to serve a full-width image size
            
            className="object-cover -z-1 brightness-75"
          />
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex flex-col w-full md:w-1/2 text-white">
              <h1 className="text-5xl font-bold font-young">
                Samarinda <span className="text-primary-light">Hash </span> <br className="hidden sm:inline" />
                House Harriers
              </h1>
              <h2 className="text-3xl font-semibold font-young my-4">On On! - <span className="text-primary-text">Adventure in <span className="text-secondary-text">Nature</span></span></h2>
              <p className="py-5">
                A Drinking Club With a Running Problem,
                Kami mengadakan lari mingguan di berbagai sudut kota dan alam Kalimantan, dilanjutkan dengan sesi down-down yang penuh keceriaan.
              </p>
              <div className="flex flex-row flex-wrap">
                <LinkButton
                  destination="/about"
                  text="About"
                  bg_color="primary-bg"
                  bg_color_hover="primary-bg-hover"
                  bg_color_active="primary-bg-active"
                />
                <LinkButton
                  destination="/events"
                  text="Event Terdekat"
                  bg_color="primary-bg"
                  bg_color_hover="primary-bg-hover"
                  bg_color_active="primary-bg-active"
                />

              </div>
            </div>
            <div className="flex flex-col p-8 w-full md:w-1/2 items-center">
              <Image
                src="/assets/images/sh3logo.png"
                alt="Logo"
                width={250}
                height={250}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-b from-transparent to-white -z-1" />
        </div>


      </RevealSection>

      <RevealSection direction="up">
        <Carousel />
      </RevealSection>


      <RevealSection direction="up">
        <TotalStatistic />
        <div className="flex flex-col bg-primary-light-active p-8 gap-y-8">
          <div className="text-white text-2xl text-center font-young lining-nums">
            REGULAR RUN  |  EVERY SUNDAY 14.30 WITA OPEN REGISTRATION | Samarinda
          </div>
        </div>
      </RevealSection>



      <div className="bg-primary-bg p-8">
        <h2 className="text-4xl font-bold flex justify-center font-young text-white my-16" id="upcomingRun">
          Event yang Akan Datang
        </h2>
        <div className="flex md:flex-row justify-center gap-8 flex-col items-center">
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : (
            events
              .filter((item) => new Date(item.start_date) > now)
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


        <h2 className="text-4xl font-bold flex justify-center font-young text-white my-16">
          Event yang Sudah Selesai
        </h2>
        <div className="flex md:flex-row justify-center gap-8 flex-col items-center">
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