"use server"

import { getSupabaseServerClient } from "./supabase"

export async function checkImagesInStorage() {
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

    const results = {
      total: mediaRecords?.length || 0,
      accessible: 0,
      inaccessible: 0,
      details: [] as Array<{ id: string; url: string; exists: boolean }>,
    }

    // Check each image URL
    for (const media of mediaRecords || []) {
      try {
        // Extract bucket and path from URL if it's a Supabase URL
        if (media.url && media.url.includes("supabase.co/storage")) {
          const urlParts = media.url.split("/public/")
          if (urlParts.length === 2) {
            const [bucketPath] = urlParts[1].split("/", 1)
            const filePath = urlParts[1].substring(bucketPath.length + 1)

            // Check if the file exists in storage
            const { data, error } = await supabase.storage.from(bucketPath).download(filePath)

            const exists = !error && data !== null

            results.details.push({
              id: media.id,
              url: media.url,
              exists,
            })

            if (exists) {
              results.accessible++
            } else {
              results.inaccessible++
            }
          } else {
            results.details.push({
              id: media.id,
              url: media.url,
              exists: false,
            })
            results.inaccessible++
          }
        } else {
          // For non-Supabase URLs, try a HEAD request
          try {
            const response = await fetch(media.url, { method: "HEAD" })
            const exists = response.ok

            results.details.push({
              id: media.id,
              url: media.url,
              exists,
            })

            if (exists) {
              results.accessible++
            } else {
              results.inaccessible++
            }
          } catch (fetchError) {
            results.details.push({
              id: media.id,
              url: media.url,
              exists: false,
            })
            results.inaccessible++
          }
        }
      } catch (checkError) {
        console.error(`Error checking media ${media.id}:`, checkError)
        results.details.push({
          id: media.id,
          url: media.url,
          exists: false,
        })
        results.inaccessible++
      }
    }

    return {
      success: true,
      message: `Checked ${results.total} images. ${results.accessible} accessible, ${results.inaccessible} inaccessible.`,
      results,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error checking images: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
