import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = getSupabaseServerClient()

    // Define categories
    const categories = [
      { name: "Cybergirl", slug: "cybergirl" },
      { name: "Characters", slug: "characters" },
      { name: "Play on Space", slug: "play-on-space" },
      { name: "Portals", slug: "portals" },
      { name: "Transversive Media", slug: "transversive-media" },
      { name: "Film", slug: "film" },
      { name: "Painting", slug: "painting" },
    ]

    // Insert categories
    const { data, error } = await supabase.from("categories").upsert(categories, { onConflict: "slug" }).select()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error seeding categories:", error)
    return NextResponse.json({ success: false, error: "Failed to seed categories" }, { status: 500 })
  }
}
