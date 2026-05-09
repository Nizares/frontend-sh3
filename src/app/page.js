import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Container from "@/src/components/Container";
import Carousel from "@/src/components/Carousel";
import EventCard from "@/src/components/EventCard";

const dummyEvents = [
  {
    id: 1,
    title: "Borneo Nash Hash 2027",
    start_date: "2027-10-23",
    end_date: "2027-10-24",
    category: "Long Run",
    img: "/assets/images/poster2027.jpg",
    eventog: "Samarinda Hash House Harriers",
    status: "ongoing"
  },
  {
    id: 2,
    title: "Borneo Nash Hash 2027",
    start_date: "2027-10-23",
    end_date: "2027-10-24",
    category: "Long Run",
    img: "/assets/images/poster2027.jpg",
    eventog: "Samarinda Hash House Harriers",
    status: "ongoing"
  },
  {
    id: 3,
    title: "Ketupat Cap Go Meh Run 2026",
    start_date: "2026-03-29",
    end_date: "2026-03-30",
    category: "Long Run",
    img: "/assets/images/ketupat_banner.jpg",
    eventog: "Samarinda Hash House Harriers",
    status: "ended"
  },
  {
    id: 4,
    title: "Ketupat Cap Go Meh Run 2026",
    start_date: "2026-03-29",
    end_date: "2026-03-30",
    category: "Long Run",
    img: "/assets/images/ketupat_banner.jpg",
    eventog: "Samarinda Hash House Harriers",
    status: "ended"
  },
  {
    id: 5,
    title: "Ketupat Cap Go Meh Run 2026",
    start_date: "2026-03-29",
    end_date: "2026-03-30",
    category: "Long Run",
    img: "/assets/images/ketupat_banner.jpg",
    eventog: "Samarinda Hash House Harriers",
    status: "ended"
  },
  {
    id: 6,
    title: "Ketupat Cap Go Meh Run 2026",
    start_date: "2026-03-29",
    end_date: "2026-03-30",
    category: "Long Run",
    img: "/assets/images/ketupat_banner.jpg",
    eventog: "Samarinda Hash House Harriers",
    status: "ended"
  },
]

export default function Home() {
  const now = new Date();
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
          className="
          w-40 h-40
          md:w-64 md:h-64
          lg:w-64 lg:h-64
          object-cover rounded-lg
        "
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

        {dummyEvents
          .filter((item) => new Date(item.start_date) > now)
          .map((item) => (

            <EventCard
              key={item.id}
              title={item.title}
              start_date={item.start_date}
              end_date={item.end_date}
              category={item.category}
              img={item.img}
              status={item.status}
            />
          ))
        }
      </div>



      <h2 className="text-5xl font-bold flex justify-center">Event yang Sudah Selesai</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {dummyEvents
            .filter((item) => new Date(item.start_date) < now)
            .map((item) => (

              <EventCard
              key={item.id}
              title={item.title}
              start_date={item.start_date}
              end_date={item.end_date}
              category={item.category}
              img={item.img}
              status={item.status}
              />
            ))
          }
        </div>
      </div>
    </Container>

  );
}
