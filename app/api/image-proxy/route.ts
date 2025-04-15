import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get the image URL from the query parameter
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 })
  }

  try {
    console.log(`Image proxy attempting to fetch: ${url}`)

    // Check if the URL is accessible with a HEAD request first
    try {
      const headResponse = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!headResponse.ok) {
        console.error(`HEAD check failed for ${url}: ${headResponse.status} ${headResponse.statusText}`)
        // Return a placeholder image instead of an error
        return NextResponse.redirect(new URL("/placeholder.svg?height=400&width=400", request.url))
      }
    } catch (headError) {
      console.error(`HEAD check error for ${url}:`, headError)
      // Continue anyway, as some servers might not support HEAD requests
    }

    // Fetch the image from the original URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch image from ${url}: ${response.status} ${response.statusText}`)
      // Return a placeholder image instead of an error
      return NextResponse.redirect(new URL("/placeholder.svg?height=400&width=400", request.url))
    }

    // Get the image data
    const imageData = await response.arrayBuffer()

    // Get the content type from the original response
    const contentType = response.headers.get("content-type") || "image/jpeg"

    // Return the image with the appropriate content type
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error(`Error proxying image from ${url}:`, error)
    // Return a placeholder image instead of an error
    return NextResponse.redirect(new URL("/placeholder.svg?height=400&width=400", request.url))
  }
}
