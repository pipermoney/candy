"use client"

import { useState } from "react"
import { updateMediaUrlsToSamples } from "@/lib/update-media-urls"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function FixAllImagesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFixImages = async () => {
    setLoading(true)
    setResult(null)

    try {
      const result = await updateMediaUrlsToSamples()
      setResult(result)
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
        <h1 className="text-2xl font-bold mb-6">Fix All Images</h1>

        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h2 className="font-medium text-yellow-800 mb-2">Quick Fix Solution</h2>
            <p className="text-yellow-700 mb-4">
              This tool will replace all your image URLs with working sample images from Unsplash. This is a quick
              solution to get your site working while you fix the underlying storage issues.
            </p>
            <div className="bg-white p-2 rounded border border-yellow-300">
              <p className="text-red-600 font-medium">Warning: This will replace all your image URLs!</p>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone. Only use this if you're okay with replacing your current images with
                sample images.
              </p>
            </div>
          </div>

          <button
            onClick={handleFixImages}
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Fixing All Images...
              </>
            ) : (
              "Fix All Images Now"
            )}
          </button>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <p className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</p>
              {result.success && (
                <p className="mt-2 text-green-700">
                  Your images have been updated. Please check your site to see the changes.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Link href="/admin" className="text-blue-600 hover:underline">
              Back to Admin
            </Link>
            <Link href="/" className="text-blue-600 hover:underline">
              View Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
