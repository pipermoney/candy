import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    // Revalidate the home page
    revalidatePath("/")

    // Revalidate the artwork pages
    revalidatePath("/artwork/[slug]", "layout")

    // Revalidate other pages
    revalidatePath("/about")
    revalidatePath("/grid")
    revalidatePath("/all")

    return NextResponse.json({
      success: true,
      message: "Cache refreshed successfully!",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error refreshing cache:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to refresh cache: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
