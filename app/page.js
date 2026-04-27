import Image from "next/image"
import Link from "next/link"
import "./globals.css";
import Container from "@/components/Container";
import Carousel from "@/components/Carousel";
import EventCard from "@/components/EventCard";


export default function Home() {
  return (
    <Container className="flex flex-col gap-y-16">
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <h1 className="text-[#1D242D] text-5xl font-bold">Samarinda Hash House Harriers</h1>
      <h2 className="text-[#1D242D] text-3xl font-semibold">On On!</h2>
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
        className="bg-[#2D6A4F] text-white px-6 py-2.5 m-5 rounded-full font-medium hover:bg-[#245a42] transition-colors"
      >
        Tentang Kami
      </Link>
    </div>

    <Carousel />
    <h2 className="text-5xl font-bold flex justify-center">Event yang Akan Datang</h2>
    <div className="flex md:flex-row justify-center gap-8 flex-col items-center">
          <EventCard 
          title="Borneo Nash Hash 2027"
          date="Samarinda, 23-24 Oct 2027"
          category="Long Run"
          img="/assets/images/ketupat_banner.jpg"
          status="ongoing"
          />

          <EventCard 
          title="Borneo Nash Hash 2027"
          date="Samarinda, 23-24 Oct 2027"
          category="Long Run"
          img="/assets/images/ketupat_banner.jpg"
          status="ongoing"
          />
    </div>



    <h2 className="text-5xl font-bold flex justify-center">Event yang Sudah Selesai</h2>
    <div className="flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
        
        <EventCard 
        title="Borneo Nash Hash 2027"
        date="Samarinda, 23-24 Oct 2027"
        category="Long Run"
        img="/assets/images/ketupat_banner.jpg"
        status="selesai"
        />

        <EventCard 
        title="Borneo Nash Hash 2027"
        date="Samarinda, 23-24 Oct 2027"
        category="Long Run"
        img="/assets/images/ketupat_banner.jpg"
        status="selesai"
        />

        <EventCard 
        title="Borneo Nash Hash 2027"
        date="Samarinda, 23-24 Oct 2027"
        category="Long Run"
        img="/assets/images/ketupat_banner.jpg"
        status="selesai"
        />

        <EventCard 
        title="Borneo Nash Hash 2027"
        date="Samarinda, 23-24 Oct 2027"
        category="Long Run"
        img="/assets/images/ketupat_banner.jpg"
        status="selesai"
        />


    </div>
    </div>
    </Container>

  );
}
