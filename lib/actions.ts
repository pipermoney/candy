"use server"

import { revalidatePath } from "next/cache"

export async function refreshCache() {
  try {
    // Revalidate the home page
    revalidatePath("/")

    // Revalidate the artwork pages
    revalidatePath("/artwork/[slug]", "layout")

    // Revalidate the about page
    revalidatePath("/about")

    // Revalidate the grid view
    revalidatePath("/grid")

    // Revalidate the all page
    revalidatePath("/all")

    return { success: true, message: "Cache refreshed successfully!" }
  } catch (error) {
    console.error("Error refreshing cache:", error)
    return {
      success: false,
      message: `Failed to refresh cache: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
