"use server"

import { getSupabaseServerClient } from "./supabase"
import { revalidatePath } from "next/cache"

// Sample images from Unsplash (free to use)
const sampleImages = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800",
  "https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=800",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
  "https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?q=80&w=800",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800",
  "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=800",
  "https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=800",
  "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=800",
]

export async function updateMediaUrlsToSamples() {
  try {
    const supabase = getSupabaseServerClient()

    // Get all media records
    const { data: mediaRecords, error: mediaError } = await supabase
      .from("media")
      .select("id, url, type")
      .eq("type", "image")
      .limit(100)

    if (mediaError) {
      return { success: false, message: `Error fetching media: ${mediaError.message}` }
    }

    let updatedCount = 0
    let errorCount = 0

    // Update each media record with a sample image URL
    for (const media of mediaRecords || []) {
      try {
        // Pick a random sample image
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]

        // Update the media record
        const { error: updateError } = await supabase.from("media").update({ url: randomImage }).eq("id", media.id)

        if (updateError) {
          errorCount++
          console.error(`Error updating media ${media.id}: ${updateError.message}`)
        } else {
          updatedCount++
        }
      } catch (err) {
        errorCount++
        console.error(`Error processing media ${media.id}: ${err instanceof Error ? err.message : "Unknown error"}`)
      }
    }

    // Revalidate all paths to refresh the cache
    revalidatePath("/")
    revalidatePath("/grid")
    revalidatePath("/all")
    revalidatePath("/artwork/[slug]", "layout")

    return {
      success: true,
      message: `Updated ${updatedCount} of ${mediaRecords?.length || 0} media records with sample images. Encountered ${errorCount} errors.`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
