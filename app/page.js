import Image from "next/image"
import Link from "next/link"
import "./globals.css";



export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <h1 className="text-[#1D242D] text-3xl font-semibold">Samarinda Hash House Harriers</h1>
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
  );
}
