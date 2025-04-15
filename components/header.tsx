"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-20 px-6 max-w-[1800px] mx-auto">
        <Link href="/about" aria-label="About page">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/About-icon-1UNoydvKkmDPldqEAepWb4taI4SiXr.png"
              alt="About"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Link>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 z-[1001]">
          <Image
            src="/images/candypill-logo-new.png"
            alt="Candy Pill"
            width={200}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <button onClick={toggleSearch} className="p-2 z-[1001] relative" aria-label="Open search">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-[1000]">
          <div className="pt-16 h-full">
            <div className="container mx-auto px-4 pt-12">
              <input
                type="search"
                placeholder="Search artworks..."
                className="w-full text-2xl border-b border-black pb-2 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
