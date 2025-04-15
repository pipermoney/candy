"use client"

import { useState } from "react"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { refreshCache } from "@/lib/actions"

export default function AutoImportPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    found: number
    imported: number
    errors: string[]
    success: boolean
  }>({ found: 0, imported: 0, errors: [], success: false })

  // Generate a unique slug
  const generateUniqueSlug = (baseSlug: string): string => {
    // Add a timestamp and random number to ensure uniqueness
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    return `${baseSlug}-${timestamp}-${randomNum}`
  }

  const autoImport = async () => {
    setLoading(true)
    setResults({ found: 0, imported: 0, errors: [], success: false })

    try {
      const supabase = getSupabaseAdminClient()
      const errors: string[] = []

      // Step 1: List all files in the storage bucket
      const { data: files, error: filesError } = await supabase.storage.from("artwork").list()

      if (filesError) {
        throw new Error(`Failed to list files: ${filesError.message}`)
      }

      setResults((prev) => ({ ...prev, found: files.length }))

      // Filter out only image files
      const imageFiles = files.filter(
        (file) =>
          !file.id.includes("/") &&
          (file.name.endsWith(".jpg") ||
            file.name.endsWith(".jpeg") ||
            file.name.endsWith(".png") ||
            file.name.endsWith(".gif") ||
            file.name.endsWith(".webp")),
      )

      let importedCount = 0

      // Step 2: Process each image file
      for (const file of imageFiles) {
        try {
          // Get public URL for the file
          const { data: urlData } = supabase.storage.from("artwork").getPublicUrl(file.name)

          if (!urlData?.publicUrl) {
            errors.push(`Failed to get public URL for ${file.name}`)
            continue
          }

          // Create a title from the filename
          const title = file.name
            .replace(/\.[^/.]+$/, "") // Remove extension
            .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
            .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word

          // Create a media record
          const { data: mediaData, error: mediaError } = await supabase
            .from("media")
            .insert({
              url: urlData.publicUrl,
              type: "image",
              alt: title,
            })
            .select("id")
            .single()

          if (mediaError) {
            errors.push(`Failed to create media record for ${file.name}: ${mediaError.message}`)
            continue
          }

          // Create a base slug from the title
          const baseSlug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")

          // Generate unique slug
          const slug = generateUniqueSlug(baseSlug)

          // Create an artwork record
          const { error: artworkError } = await supabase.from("artworks").insert({
            title,
            slug,
            description: `Artwork titled "${title}"`,
            media_id: mediaData.id,
            year: new Date().getFullYear().toString(),
          })

          if (artworkError) {
            errors.push(`Failed to create artwork record for ${file.name}: ${artworkError.message}`)
            continue
          }

          importedCount++
        } catch (error) {
          errors.push(`Error processing ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }

      // Step 3: Refresh the cache
      await refreshCache()

      setResults({
        found: imageFiles.length,
        imported: importedCount,
        errors,
        success: importedCount > 0,
      })
    } catch (error) {
      setResults({
        found: 0,
        imported: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        success: false,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Auto-Import Images</h1>

        <p className="mb-6 text-gray-600">
          This tool will automatically scan your Supabase storage bucket, find all images, and create the necessary
          database records.
        </p>

        <button
          onClick={autoImport}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
              Scanning and Importing...
            </>
          ) : (
            "Auto-Import Images"
          )}
        </button>

        {results.found > 0 && (
          <div className="mt-8 space-y-4">
            <div
              className={`p-4 rounded-lg ${results.success ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
            >
              <div className="flex items-start">
                {results.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-medium">Import Results</h3>
                  <p>Found {results.found} images in storage</p>
                  <p>Successfully imported {results.imported} images</p>
                  {results.errors.length > 0 && <p>Encountered {results.errors.length} errors</p>}
                </div>
              </div>
            </div>

            {results.success && (
              <div className="flex justify-center">
                <Link href="/gallery" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Your Gallery
                </Link>
              </div>
            )}

            {results.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-700 mb-2">Errors:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-red-600">
                  {results.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {results.errors.length > 5 && <li>...and {results.errors.length - 5} more errors</li>}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Admin
          </Link>
          <Link href="/debug" className="text-blue-600 hover:underline">
            View Debug Page
          </Link>
        </div>
      </div>
    </div>
  )
}
