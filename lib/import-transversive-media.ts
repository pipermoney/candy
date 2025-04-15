"use server"

import { getSupabaseServerClient } from "./supabase"
import { revalidatePath } from "next/cache"

// Define the artworks to import
const transversiveMediaArtworks = [
  {
    name: "Transversive Media 01",
    filename: "transversivemedia_01.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_01-Art7dNc8RrvsAQS5jeaMkVe1Vkp67S.png",
    description: "Textile print with halftone effect showing hands against a red background with screen-like border.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "24 × 18 inches",
  },
  {
    name: "Transversive Media 02",
    filename: "transversivemedia_02.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_02-BpuEucL2hdpXprMgnxbiVVAL7b3hgi.png",
    description: "Textile print showing close-up of hands with food items and packaging.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "18 × 12 inches",
  },
  {
    name: "Transversive Media 03",
    filename: "transversivemedia_03.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_03-itixc1055cFRCznqDNqesnyemRMJLz.png",
    description: "Textile print showing hands with tarot cards and keys against a red background.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "20 × 16 inches",
  },
  {
    name: "Transversive Media 04",
    filename: "transversivemedia_04.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_04-w0Y9Mca4xJ1kGi33nkaUEQefPT3aBi.png",
    description: "Textile print showing a close-up portrait with dice and snake elements.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "24 × 12 inches",
  },
  {
    name: "Transversive Media 05",
    filename: "transversivemedia_05.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_05-zvOyYye5JuRAJfsSdlapMfTgifT02s.png",
    description: "Textile print with abstract body forms in soft pink and white tones.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "18 × 18 inches",
  },
  {
    name: "Transversive Media 06",
    filename: "transversivemedia_06.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_06-tQ562maU2LYxgS9YPven1QIBpOzU46.png",
    description: "Textile print showing a figure with red hair in blue clothing overlaid with green plant elements.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "24 × 14 inches",
  },
  {
    name: "Transversive Media 07",
    filename: "transversivemedia_07.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_07-zpPGGDiiBNaJkpt0wqxytlic8LUmRR.png",
    description: "Vertical textile print showing a distorted landscape with reddish figures.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "36 × 12 inches",
  },
  {
    name: "Transversive Media 08",
    filename: "transversivemedia_08.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_08-M5oZrFwN56AdlwNj89CRW4an3bktOG.png",
    description: "Vertical textile print with distorted landscape and repeated figures.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "36 × 12 inches",
  },
  {
    name: "Transversive Media 09",
    filename: "transversivemedia_09.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_09-3ZSA2oYciv2RQX47hIXgaBfpyOPr0A.png",
    description: "Textile print showing a figure with blue-tinted hair looking upward.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "18 × 22 inches",
  },
  {
    name: "Transversive Media 10",
    filename: "transversivemedia_10.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_10-rZ5CQIKoolHFrCpvCRsm5LdiG8L0C4.png",
    description: "Vertical textile print with strips of text and images arranged horizontally on translucent fabric.",
    year: "2023",
    medium: "Digital print on fabric",
    dimensions: "36 × 14 inches",
  },
]

export async function importTransversiveMediaArtworks() {
  try {
    const supabase = getSupabaseServerClient()

    // Get the category ID for "Transversive Media"
    let categoryId: string | null = null

    // Check if the category exists
    const { data: existingCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("name", "Transversive Media")
      .single()

    if (existingCategory) {
      categoryId = existingCategory.id
    } else {
      // Create the category if it doesn't exist
      const { data: newCategory, error: categoryError } = await supabase
        .from("categories")
        .insert({
          name: "Transversive Media",
          slug: "transversive-media",
        })
        .select("id")
        .single()

      if (categoryError) {
        throw new Error(`Failed to create category: ${categoryError.message}`)
      }

      categoryId = newCategory.id
    }

    const results = {
      total: transversiveMediaArtworks.length,
      imported: 0,
      errors: [] as string[],
    }

    // Import each artwork
    for (const artwork of transversiveMediaArtworks) {
      try {
        // Create media record directly with the provided URL
        const { data: mediaData, error: mediaError } = await supabase
          .from("media")
          .insert({
            url: artwork.url,
            type: "image",
            alt: artwork.name,
          })
          .select("id")
          .single()

        if (mediaError) {
          results.errors.push(`Failed to create media for ${artwork.name}: ${mediaError.message}`)
          continue
        }

        // Generate a unique slug
        const baseSlug = artwork.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")

        const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`

        // Create artwork record
        const { error: artworkError } = await supabase.from("artworks").insert({
          title: artwork.name,
          slug: slug,
          description: artwork.description,
          year: artwork.year,
          media_id: mediaData.id,
          category_id: categoryId,
        })

        if (artworkError) {
          results.errors.push(`Failed to create artwork for ${artwork.name}: ${artworkError.message}`)
          continue
        }

        // Add artwork details
        const details = [
          { key: "Medium", value: artwork.medium },
          { key: "Dimensions", value: artwork.dimensions },
        ]

        for (const detail of details) {
          const { error: detailError } = await supabase.from("artwork_details").insert({
            artwork_id: mediaData.id,
            key: detail.key,
            value: detail.value,
          })

          if (detailError) {
            results.errors.push(`Failed to add detail ${detail.key} for ${artwork.name}: ${detailError.message}`)
          }
        }

        results.imported++
      } catch (error) {
        results.errors.push(
          `Error importing ${artwork.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    }

    // Revalidate paths to refresh the cache
    revalidatePath("/")
    revalidatePath("/grid")
    revalidatePath("/all")
    revalidatePath("/artwork/[slug]", "layout")

    return {
      success: results.imported > 0,
      message: `Imported ${results.imported} of ${results.total} artworks. ${results.errors.length > 0 ? `Encountered ${results.errors.length} errors.` : ""}`,
      results,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error importing artworks: ${error instanceof Error ? error.message : "Unknown error"}`,
      results: {
        total: transversiveMediaArtworks.length,
        imported: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      },
    }
  }
}
