"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function CloseButton() {
  const router = useRouter()

  return (
    <div className="fixed top-24 right-8 z-40">
      <button
        onClick={() => router.push("/")}
        className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"
        aria-label="Close and return to gallery"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
