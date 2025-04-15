"use client"

import { useState } from "react"
import Link from "next/link"

export default function TestImagesPage() {
  const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({})

  // Test images from different sources
  const testImages = [
    {
      id: "1",
      name: "Supabase Storage Test",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-05.png-E7k2azVONDIXqR5qEtkKbUjQGML4Pt.jpeg",
    },
    {
      id: "2",
      name: "Placeholder SVG",
      url: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "3",
      name: "External Image",
      url: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=1000",
    },
  ]

  const handleImageLoad = (id: string) => {
    setImageStatus((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const handleImageError = (id: string) => {
    setImageStatus((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
        <p className="mb-6 text-gray-600">
          This page tests basic image loading functionality to help diagnose issues with your images.
        </p>

        <div className="space-y-8">
          {testImages.map((image) => (
            <div key={image.id} className="border rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2">{image.name}</h2>
              <p className="text-sm text-gray-500 mb-4 break-all">{image.url}</p>

              <div className="relative aspect-square max-w-xs mx-auto bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id)}
                />
              </div>

              <div className="mt-4 text-center">
                {imageStatus[image.id] === true && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✓ Image loaded successfully
                  </span>
                )}
                {imageStatus[image.id] === false && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">✗ Failed to load image</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Admin
          </Link>
          <Link href="/admin/diagnose-images" className="text-blue-600 hover:underline">
            Go to Image Diagnostics
          </Link>
        </div>
      </div>
    </div>
  )
}
