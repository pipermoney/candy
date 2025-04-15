"use server"

import { getSupabaseServerClient } from "./supabase"

/**
 * Server action to check if an image exists in Supabase storage
 */
export async function checkSupabaseImage(bucket: string, path: string) {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return { success: false, message: `Error listing buckets: ${bucketsError.message}` }
    }

    const bucketExists = buckets.some((b) => b.name === bucket)
    if (!bucketExists) {
      return { success: false, message: `Bucket "${bucket}" does not exist` }
    }

    // Check if the file exists
    const { data, error } = await supabase.storage.from(bucket).download(path)

    if (error) {
      return { success: false, message: `Error downloading file: ${error.message}` }
    }

    return { success: true, message: "Image exists and is accessible" }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * Server action to fix media URLs in the database
 */
export async function fixMediaUrls() {
  try {
    const supabase = getSupabaseServerClient()

    // Get all media records
    const { data: mediaRecords, error: fetchError } = await supabase.from("media").select("*")

    if (fetchError) {
      return { success: false, message: `Error fetching media: ${fetchError.message}` }
    }

    let fixedCount = 0
    let errorCount = 0

    // Process each media record
    for (const media of mediaRecords || []) {
      // Check if the URL is from Supabase and needs fixing
      if (media.url && media.url.includes("supabase.co/storage")) {
        try {
          // Extract the path from the URL
          const urlParts = media.url.split("/public/")
          if (urlParts.length !== 2) continue

          const [bucketPath] = urlParts[1].split("/", 1)
          const filePath = urlParts[1].substring(bucketPath.length + 1)

          // Get the correct public URL
          const { data: urlData } = supabase.storage.from(bucketPath).getPublicUrl(filePath)

          if (urlData?.publicUrl && urlData.publicUrl !== media.url) {
            // Update the media record with the correct URL
            const { error: updateError } = await supabase
              .from("media")
              .update({ url: urlData.publicUrl })
              .eq("id", media.id)

            if (updateError) {
              errorCount++
              console.error(`Error updating media ${media.id}: ${updateError.message}`)
            } else {
              fixedCount++
            }
          }
        } catch (err) {
          errorCount++
          console.error(`Error processing media ${media.id}: ${err instanceof Error ? err.message : "Unknown error"}`)
        }
      }
    }

    return {
      success: true,
      message: `Processed ${mediaRecords?.length || 0} media records. Fixed ${fixedCount} URLs. Encountered ${errorCount} errors.`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
