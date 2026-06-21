"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href) => pathname === href

  return (
    <nav className="bg-primary-light px-8 py-4 shadow-sm sticky top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">

        {/* Logo */}
          <a className="flex items-center gap-2" href="/">
            <span className="text-4xl font-bold text-secondary-text font-young">#</span>
            <div>
              <p className="font-bold text-gray-800 leading-tight font-young">Samarinda Hash</p>
              <p className="text-xs text-gray-500 font-young">House Harriers</p>
            </div>
          </a>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-10">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/events", label: "Events" },
            { href: "/merchandise", label: "Merchandise"},
            { href: "/gallery", label: "Gallery" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors hover:text-secondary-text ${
                  isActive(item.href)
                    ? "text-secondary-text border-b-2 border-secondary-text pb-0.5"
                    : "text-neutral-text"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol Login - HANYA desktop */}
        <div className="hidden md:flex gap-4">
          <Link
            href="/members/register"
            className="bg-secondary-bg text-white px-6 py-2.5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young"
          >
            Registrasi Member
          </Link>
          <Link
            href="/members/detail"
            className="bg-secondary-bg text-white px-6 py-2.5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young"
          >
            Sudah jadi Member?
          </Link>
          <Link
            href="https://samarindahashhouseharriers.com/bnh2027/"
            className="bg-secondary-bg text-white px-6 py-2.5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young"
          >
            BNH 2027
          </Link>
        </div>

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
            { href: "/merchandise", label: "Merchandise"},
            { href: "/gallery", label: "Gallery" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block transition-colors hover:text-secondary-text ${
                  isActive(item.href)
                    ? "text-secondary-text font-medium"
                    : "text-neutral-text"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* 3 Tombol di dalam burger */}
          <li className="flex flex-col gap-3 pt-2 border-t border-gray-200">
            <Link
              href="/members/register"
              className="bg-secondary-bg text-white px-6 py-2.5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young text-center"
            >
              Registrasi Member
            </Link>
            <Link
              href="/members/detail"
              className="bg-secondary-bg text-white px-6 py-2.5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young text-center"
            >
              Sudah jadi Member?
            </Link>
            <Link
              href="https://samarindahashhouseharriers.com/bnh2027/"
              className="bg-secondary-bg text-white px-6 py-2.5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young text-center"
            >
              BNH 2027
            </Link>
          </li>
        </ul>
      </div>

    </nav>
  )
}