"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import type { Artwork } from "@/lib/types"
import MediaDisplay from "./media-display"
import CategoryFilter from "./category-filter"

export default function GridGallery({ artworks }: { artworks: Artwork[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  // Filter artworks based on selected categories (additive filtering)
  const filteredArtworks =
    selectedCategories.length > 0
      ? artworks.filter((artwork) => artwork.category && selectedCategories.includes(artwork.category))
      : artworks

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  }

  return (
    <>
      <CategoryFilter
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
        onClearCategory={handleClearCategory}
        onClearAll={handleClearAll}
      />

      <div className="pt-32 pb-12 px-4">
        <motion.div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          key={selectedCategories.join(",")} // Re-animate when filters change
        >
          {filteredArtworks.map((artwork) => (
            <motion.div key={artwork.id} variants={item} transition={{ duration: 0.5 }} className="w-full">
              <Link href={`/artwork/${artwork.slug}`} className="block">
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <MediaDisplay media={artwork.media} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  )
}
