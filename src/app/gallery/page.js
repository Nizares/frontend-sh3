import Image from "next/image";
import Link from "next/link";

import Container from "@/src/components/Container";
import MasonryGallery from "@/src/components/MasonryGallery";

const images = [
  // Section 1 (layout A — besar kiri)
  { url: "/assets/images/randomImage.jpg", title: "Borneo Jungle Run", subtitle: "Long Run Event" },
  { url: "/assets/images/randomImage.jpg", title: "Mahakam River Run", subtitle: "Long Run Event" },
  { url: "/assets/images/randomImage.jpg", title: "Heart of Borneo Run", subtitle: "Short Run Event" },
  { url: "/assets/images/randomImage.jpg", title: "Green Canopy Run", subtitle: "Short Run Event" },

  // Section 2 (layout B — besar kanan, otomatis)
  { url: "/assets/images/randomImage.jpg", title: "Rainforest Trail", subtitle: "Long Run Event" },
  { url: "/assets/images/randomImage.jpg", title: "Sunset Run", subtitle: "Short Run Event" },
  { url: "/assets/images/randomImage.jpg", title: "City Hash Run", subtitle: "Short Run Event" },
  { url: "/assets/images/randomImage.jpg", title: "River Delta Run", subtitle: "Long Run Event" },
]

export default function Gallery(){
    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <h1 className="text-5xl font-bold text-center p-8">Cerita Kami saat Berlari!</h1>
            <MasonryGallery images={images} />
        </Container>
    )
}