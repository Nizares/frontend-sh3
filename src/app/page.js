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
import { SponsorMarquee } from "../components/SponsorMarquee";
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
            src="/assets/images/home1.png"
            alt="Hero background"
            fill // 2. Forces image to expand to the parent size
            priority // 3. Preloads the image if it's above the fold
            sizes="100vh" // 4. Tells Next.js to serve a full-width image size
            className="object-cover -z-1 brightness-75"
          />
          <div className="flex flex-col justify-center items-center mt-16">
            <div className="flex flex-col p-8 w-full md:w-1/2 items-center">
              <Image
                src="/assets/images/sh3logo.png"
                alt="Logo"
                width={250}
                height={250}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col w-full md:w-3/4 text-white">
              <h1 className="text-5xl font-bold text-center">
                Samarinda {" "}
                <br className="hidden sm:inline" />
                <span className="text-primary-light">Hash </span>
                House Harriers
              </h1>
              <h2 className="text-3xl font-semibold font-young my-4 text-center">
                On On! -{" "}
                <span className="text-primary-text">
                  Adventure in{" "}
                  <span className="text-secondary-text">Nature</span>
                </span>
              </h2>
              <p className="py-5 text-center font-semibold">
                A Drinking Club With a Running Problem, Kami mengadakan lari
                mingguan di berbagai sudut kota dan alam Kalimantan, dilanjutkan
                dengan sesi down-down yang penuh keceriaan.
              </p>
              <div className="flex flex-row flex-wrap justify-center">
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

          </div>

          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-b from-transparent to-secondary-darker -z-1" />
        </div>
      </RevealSection>

      <div className="bg-secondary-darker">
        <div className="text-center text-3xl text-white mt-8 font-bold font-young">
          Sponsor
        </div>
        <RevealSection direction="up">

          <SponsorMarquee />
        </RevealSection>
      </div>

      <div className="bg-secondary-darker">
        <RevealSection direction="up">
          <div className="mt-8">
            <Carousel />
          </div>
        </RevealSection>
      </div>


      <RevealSection direction="up">
        <TotalStatistic />
        <div className="flex flex-col bg-primary-light-active p-8 gap-y-8">
          <div className="text-white text-2xl text-center font-young lining-nums">
            REGULAR RUN | EVERY SUNDAY 14.30 WITA OPEN REGISTRATION | Samarinda
          </div>
        </div>
      </RevealSection>

      <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light p-8">
        <div
          className="absolute top-0 left-0 h-full w-28 bg-repeat-y bg-left mask-r-from-5%"
          style={{ backgroundImage: `url('/assets/images/batik4.svg')`, backgroundSize: '112px' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-28 bg-repeat-y bg-left -scale-x-100 mask-r-from-5%"
          style={{ backgroundImage: `url('/assets/images/batik4.svg')`, backgroundSize: '112px' }}
        />
        <h2
          className="text-4xl font-bold flex justify-center font-young text-primary-darker my-16"
          id="upcomingRun"
        >
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
                <RevealSection key={i} direction="up" delay={i * 100} className="flex-1">
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

        <h2 className="text-4xl font-bold flex justify-center font-young text-primary-darker my-16">
          Event yang Sudah Selesai
        </h2>
        <div className="flex md:flex-row justify-between gap-8 flex-col">
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : (
            events
              .filter((item) => new Date(item.start_date) < now)
              .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
              .slice(0, 4)
              .map((item, i) => (
                <RevealSection key={i} direction="up" delay={i * 100} className="flex-1">
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
