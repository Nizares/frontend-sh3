"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation" // ← tambah ini

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() // ← berisi path halaman aktif, misal "/about"

  // fungsi untuk cek apakah link aktif
  const isActive = (href) => pathname === href

  return (
    <nav className="bg-[#F5F0E8] px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-[#B57506]">#</span>
          <div>
            <p className="font-bold text-gray-800 leading-tight">Samarinda Hash</p>
            <p className="text-xs text-gray-500">House Harriers</p>
          </div>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-10">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/events", label: "Events" },
            { href: "/members", label: "Members" },
            { href: "/gallery", label: "Gallery" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors hover:text-[#C9A84C] ${
                  isActive(item.href)
                    ? "text-[#C9A84C] border-b-2 border-[#C9A84C] pb-0.5" // ← aktif
                    : "text-gray-700" // ← tidak aktif
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol Login */}
        <Link
          href="/members"
          className="hidden md:block bg-btn-green-normal active:to-btn-green-active hover:to-btn-green-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          Registrasi Member
        </Link>

        {/* Burger Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>

      {/* Menu Mobile */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 mt-4" : "max-h-0"}`}>
        <ul className="flex flex-col gap-4 pb-4">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/events", label: "Events" },
            { href: "/members", label: "Members" },
            { href: "/gallery", label: "Gallery" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block transition-colors hover:text-[#C9A84C] ${
                  isActive(item.href)
                    ? "text-[#C9A84C] font-medium"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/members"
              className="block bg-btn-green-normal active:to-btn-green-active hover:to-btn-green-hover text-white text-center px-6 py-2.5 rounded-full font-medium transition-colors"
            >
              Registrasi Member
            </Link>
          </li>
        </ul>
      </div>

    </nav>
  )
}