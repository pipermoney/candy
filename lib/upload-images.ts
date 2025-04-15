import { getSupabaseAdminClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Function to upload an image URL to Supabase storage
export async function uploadImageFromUrl(imageUrl: string, fileName: string) {
  try {
    const supabase = getSupabaseAdminClient()

    // Fetch the image
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Generate a unique file name
    const fileExt = fileName.split(".").pop()
    const uniqueFileName = `${uuidv4()}.${fileExt}`
    const filePath = `images/${uniqueFileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("artwork").upload(filePath, blob)

    if (error) {
      throw error
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from("artwork").getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath,
      fileName: uniqueFileName,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Function to create a media record in the database
export async function createMediaRecord(url: string, type: "image" | "video" | "audio", alt: string) {
  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from("media")
      .insert({
        url,
        type,
        alt,
      })
      .select("id")
      .single()

    if (error) {
      throw error
    }

    return data.id
  } catch (error) {
    console.error("Error creating media record:", error)
    throw error
  }
}
