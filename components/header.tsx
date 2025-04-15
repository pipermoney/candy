"use client"

import Link from "next/link"
import Image from "next/image"

export default function Header() {
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
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/images/candypill-logo-new.png"
            alt="Candy Pill"
            width={200}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>
        {/* Search button removed */}
        <div className="w-10 h-10"></div> {/* Empty div to maintain layout balance */}
      </div>
    </header>
  )
}
