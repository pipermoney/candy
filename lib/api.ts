import { allArtworks, categories } from "./local-data"
import type { Artwork } from "./types"

// Get all artworks from local data
export async function getArtworks(): Promise<Artwork[]> {
  // Simulate a network delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log(`Fetched ${allArtworks.length} artworks from local data`)
  return allArtworks
}

// Get a single artwork by slug
export async function getArtwork(slug: string): Promise<Artwork | null> {
  // Simulate a network delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 200))

  const artwork = allArtworks.find((art) => art.slug === slug)

  if (!artwork) {
    console.error(`Artwork with slug ${slug} not found`)
    return null
  }

  return artwork
}

// Get all categories
export async function getCategories() {
  // Simulate a network delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 100))

  return categories
}

// Get all exhibitions
export async function getExhibitions() {
  // Simulate a network delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 100))

  return [
    {
      id: "1",
      title: "Living Landscapes",
      venue: "Vital",
      location: "New York, NY",
      year: "2022",
      description: "Solo exhibition exploring digital landscapes and virtual environments.",
    },
    {
      id: "2",
      title: "Digital Identities",
      venue: "Virtual Gallery",
      location: "Online",
      year: "2023",
      description: "Group exhibition examining the intersection of identity and technology.",
    },
    {
      id: "3",
      title: "Summer Salon Show",
      venue: "Greenpoint Gallery",
      location: "New York, NY",
      year: "2016",
      description: "Annual group exhibition featuring emerging artists.",
    },
  ]
}
