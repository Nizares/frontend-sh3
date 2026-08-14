"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext"

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()

  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const updatedUser = JSON.parse(e.newValue);
          setLocalUser(updatedUser);
        } catch (err) {
          console.error('Error parsing user from storage:', err);
        }
      }
    };

    const handleUserUpdate = (e) => {
      if (e.detail?.user) {
        setLocalUser(e.detail.user);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-updated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMounted && isLoggedIn) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (localUser && parsedUser.avatar !== localUser.avatar) {
              setLocalUser(parsedUser);
            }
          } catch (err) {
            // silent
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMounted, isLoggedIn, localUser]);

  const isActive = (href) => pathname === href
  const isHome = pathname === "/";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [isHome]);

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const getNavBg = () => {
    if (isHome && !isScrolled && !isOpen) {
      return "bg-transparent";
    }
    return "bg-primary-light";
  }

  const getNavColor = () => {
    if (isHome && !isScrolled && !isOpen) {
      return "text-neutral-lighter";
    }
    return "text-neutral-dark";
  }

  const getBurgColor = () => {
    if (isHome && !isScrolled && !isOpen) {
      return "bg-neutral-lighter";
    }
    return "bg-neutral-dark";
  }

  const getNavActive = () => {
    if (isHome && !isScrolled && !isOpen) {
      return "border-primary-text text-primary-text";
    }
    return "border-secondary-text text-secondary-text";
  }

  const getNavHover = () => {
    if (isHome && !isScrolled && !isOpen) {
      return "hover:text-primary-text";
    }
    return "hover:text-secondary-text";
  }

  const handleLogout = async () => {
    setIsDropdownOpen(false)
    if (confirm("Yakin mau logout?")) {
      logout()
      setLocalUser(null)
      router.push("/")
    }
  }

  const goToProfile = () => {
    setIsDropdownOpen(false)
    router.push("/members/detail")
  }

  const goToMembership = () => {
    setIsDropdownOpen(false)
    router.push("/membership")
  }

  const userData = localUser || user;

  const statusMember = () => {
    const status = userData?.membership_type || "";
    if (status == "none") {
      return "Bukan Member"
    } else { 
      return "Member"
    }
  }
  const status_member = statusMember();
  const name = userData?.name || "";
  const photo = userData?.avatar || "";
  const isUserLoggedIn = isLoggedIn && !!userData;

  return (
    <nav className={` px-8 py-4 shadow-sm fixed top-0 left-0 w-full z-50 transition-all ${getNavBg()} `}>
      <div className="flex items-center justify-between">

        {/* Logo */}
        <a className="flex items-center gap-2" href="/">
          <span className="text-4xl font-bold text-primary-normal">#</span>
          <div>
            <p className={`font-bold leading-tight ${getNavColor()}`}>Samarinda Hash</p>
            <p className={`text-xs ${getNavColor()}`}>House Harriers</p>
          </div>
        </a>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-10">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/events", label: "Events" },
            { href: "/merchandise", label: "Merchandise" },
            { href: "/gallery", label: "Gallery" },
            { href: "/sponsor", label: "Sponsorship" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors ${getNavHover()} ${isActive(item.href)
                  ? `border-b-2 ${getNavActive()}  pb-0.5`
                  : getNavColor()
                  }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol Auth - DESKTOP */}
        <div className="hidden md:flex gap-4">
          {isMounted && isUserLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none hover:bg-white/50 rounded-full px-3 py-2 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center overflow-hidden border-2 border-secondary-bg">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="object-cover w-full h-full"
                      key={photo}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <span class="text-white font-bold text-lg">
                            ${name ? name.charAt(0).toUpperCase() : "?"}
                          </span>
                        `;
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {name ? name.charAt(0).toUpperCase() : "?"}
                    </span>
                  )}
                </div>

                <div className="hidden lg:block text-left">
                  <p className={`text-sm font-semibold ${getNavColor()}`}>
                    {name || "User"}
                  </p>
                  <p className={`text-xs font-mono ${getNavColor()} opacity-70`}>
                    {status_member || "------"}
                  </p>
                </div>

                <svg
                  className={`w-4 h-4 ${getNavColor()} transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">
                      {name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {status_member || "------"}
                    </p>
                  </div>
                  
                  <button
                    onClick={goToProfile}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile Saya</span>
                    </span>
                  </button>

                  <button
                    onClick={goToMembership}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Membership</span>
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/members/register"
                className="bg-emerald-600 text-white rounded-sm px-6 py-2.5 font-medium hover:bg-emerald-500 active:bg-emerald-400"
              >
                Registrasi
              </Link>
              <Link
                href="/members/detail"
                className="bg-emerald-600 text-white rounded-sm px-6 py-2.5 font-medium hover:bg-emerald-500 active:bg-emerald-400"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Burger Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`block w-6 h-0.5 ${getBurgColor()} transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 ${getBurgColor()} transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 ${getBurgColor()} transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>

      {/* 🔥 Menu Mobile - FIX OVERFLOW */}
      <div className={`md:hidden transition-all duration-300 overflow-y-auto ${isOpen ? "max-h-[80vh] mt-4" : "max-h-0"}`}>
        <ul className="flex flex-col gap-4 pb-4">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/events", label: "Events" },
            { href: "/merchandise", label: "Merchandise" },
            { href: "/gallery", label: "Gallery" },
            { href: "/sponsor", label: "Sponsorship" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block transition-colors hover:text-secondary-text ${isActive(item.href)
                  ? "text-secondary-text font-medium"
                  : getNavColor()
                  }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* 🔥 Tombol Auth di Mobile */}
          <li className="flex flex-col gap-3 pt-2 border-t border-gray-200">
            {isMounted && isUserLoggedIn ? (
              <>
                <Link
                  href="/members/detail"
                  className="bg-secondary-bg text-white px-6 py-2.5 font-medium rounded-md hover:bg-secondary-bg-hover text-center transition-colors"
                >
                  Profile Saya
                </Link>
                <Link
                  href="/membership"
                  className="bg-secondary-bg text-white px-6 py-2.5 font-medium rounded-md hover:bg-secondary-bg-hover text-center transition-colors"
                >
                  Membership
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-6 py-2.5 font-medium rounded-md text-center transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/members/register"
                  className="bg-emerald-600 text-white px-6 py-2.5 font-medium rounded-md hover:bg-emerald-500 active:bg-emerald-400 text-center transition-colors"
                >
                  Registrasi
                </Link>
                <Link
                  href="/members/detail"
                  className="bg-emerald-600 text-white px-6 py-2.5 font-medium rounded-md hover:bg-emerald-500 active:bg-emerald-400 text-center transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>

    </nav>
  )
}