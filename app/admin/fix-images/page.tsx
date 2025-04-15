"use client"

import { useState } from "react"
import { fixMediaUrls } from "@/lib/image-actions"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function FixImagesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFixImages = async () => {
    setLoading(true)
    try {
      const result = await fixMediaUrls()
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
        <h1 className="text-2xl font-bold mb-6">Fix Image URLs</h1>

        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h2 className="font-medium text-yellow-800 mb-2">About This Tool</h2>
            <p className="text-yellow-700 mb-4">
              This tool will scan your media records in the database and fix any incorrect Supabase storage URLs. This
              can help resolve issues with images not displaying correctly.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
              <li>It will check all media records in your database</li>
              <li>It will update URLs that are incorrectly formatted</li>
              <li>It will ensure URLs point to the correct Supabase storage location</li>
              <li>After fixing, you should refresh the cache to see the changes</li>
            </ul>
          </div>

          <button
            onClick={handleFixImages}
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Fixing Image URLs...
              </>
            ) : (
              "Fix Image URLs"
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

          <div className="flex justify-between pt-4 border-t mt-6">
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
