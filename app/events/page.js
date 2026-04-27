import Image from "next/image"
import Link from "next/link"
import Container from "@/components/Container";
import Carousel from "@/components/Carousel";
import EventCard from "@/components/EventCard";


export default function Events() {
  return (
    <Container className="flex flex-col gap-y-8">
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <h1 className="text-[#1D242D] text-5xl font-bold">Samarinda Hash House Harriers</h1>

    </div>

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
