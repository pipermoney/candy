"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import type { Artwork } from "@/lib/types"
import MediaDisplay from "./media-display"
import CategoryFilter from "./category-filter"

export default function FloatingGallery({ artworks }: { artworks: Artwork[] }) {
  const containerRef = useRef(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  console.log(`FloatingGallery received ${artworks.length} artworks`)

  // Filter artworks based on selected categories (additive filtering)
  const filteredArtworks =
    selectedCategories.length > 0
      ? artworks.filter((artwork) => artwork.category && selectedCategories.includes(artwork.category))
      : artworks

  console.log(`After filtering: ${filteredArtworks.length} artworks to display`)

  // Handle category selection
  const handleSelectCategory = (category: string) => {
    setSelectedCategories((prev) => [...prev, category])
  }

  // Handle category removal
  const handleClearCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category))
  }

  // Clear all categories
  const handleClearAll = () => {
    setSelectedCategories([])
  }

  return (
    <>
      <CategoryFilter
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
        onClearCategory={handleClearCategory}
        onClearAll={handleClearAll}
      />

      <div ref={containerRef} className="pt-32 pb-24">
        {filteredArtworks.length > 0 ? (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredArtworks.map((artwork) => (
                <div key={artwork.id} className="w-full">
                  <Link href={`/artwork/${artwork.slug}`} className="block">
                    <div className="relative aspect-square w-full overflow-hidden rounded-md">
                      <MediaDisplay media={artwork.media} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No artworks found. Try importing some first.</p>
          </div>
        )}
      </div>
    </>
  )
}
