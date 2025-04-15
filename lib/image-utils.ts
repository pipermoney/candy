/**
 * Utility functions for handling images
 */

/**
 * Checks if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Gets a public URL for an image from Supabase storage
 */
export function getPublicImageUrl(bucket: string, path: string): string {
  // Make sure the bucket and path are provided
  if (!bucket || !path) {
    return "/placeholder.svg"
  }

  // Get the Supabase URL from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    return "/placeholder.svg"
  }

  // Construct the public URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Checks if an image exists at the given URL
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (e) {
    return false
  }
}
