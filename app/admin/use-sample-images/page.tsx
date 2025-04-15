"use client"

import { useState } from "react"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import Link from "next/link"

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

export default function UseSampleImagesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleUseSampleImages = async () => {
    setLoading(true)
    setResult(null)

    try {
      const supabase = getSupabaseAdminClient()

      // Get all media records
      const { data: mediaRecords, error: mediaError } = await supabase
        .from("media")
        .select("id, url, type")
        .eq("type", "image")
        .limit(100)

      if (mediaError) {
        throw new Error(`Error fetching media: ${mediaError.message}`)
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

      setResult({
        success: true,
        message: `Updated ${updatedCount} of ${mediaRecords?.length || 0} media records with sample images. Encountered ${errorCount} errors.`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Use Sample Images</h1>

        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h2 className="font-medium text-yellow-800 mb-2">About This Tool</h2>
            <p className="text-yellow-700 mb-4">
              This tool will replace all your image URLs with sample images from Unsplash. This is useful if your
              Supabase storage images are not accessible and you want to quickly get your site working with placeholder
              images.
            </p>
            <div className="bg-white p-2 rounded border border-yellow-300">
              <p className="text-red-600 font-medium">Warning: This will replace all your image URLs!</p>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone. Only use this if you're okay with replacing your current images with
                sample images.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {sampleImages.map((url, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Sample ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleUseSampleImages}
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Updating Image URLs...
              </>
            ) : (
              "Use Sample Images"
            )}
          </button>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <p className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Link href="/admin" className="text-blue-600 hover:underline">
              Back to Admin
            </Link>
            <Link href="/admin/refresh" className="text-blue-600 hover:underline">
              Refresh Cache
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
