"use client"

import { useState, useEffect } from "react"
import { getSupabaseAdminClient } from "@/lib/supabase"
import Link from "next/link"

export default function DiagnoseImagesPage() {
  const [loading, setLoading] = useState(true)
  const [mediaRecords, setMediaRecords] = useState<any[]>([])
  const [artworkRecords, setArtworkRecords] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabaseAdminClient()

        // Fetch media records
        const { data: media, error: mediaError } = await supabase.from("media").select("*").limit(20)

        if (mediaError) throw new Error(`Media fetch error: ${mediaError.message}`)

        // Fetch artwork records
        const { data: artworks, error: artworksError } = await supabase
          .from("artworks")
          .select("*, media:media_id(*)")
          .limit(20)

        if (artworksError) throw new Error(`Artworks fetch error: ${artworksError.message}`)

        setMediaRecords(media || [])
        setArtworkRecords(artworks || [])
      } catch (err) {
        console.error("Diagnostic error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleImageLoad = (id: string) => {
    setImageLoadStatus((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const handleImageError = (id: string, url: string) => {
    console.error(`Failed to load image with ID ${id} from URL: ${url}`)
    setImageLoadStatus((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Image Diagnostics</h1>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {loading ? (
          <div className="text-center py-12">Loading diagnostic data...</div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Media Records ({mediaRecords.length})</h2>
              {mediaRecords.length === 0 ? (
                <p className="text-red-600">No media records found in the database!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mediaRecords.map((media) => (
                        <tr key={media.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{media.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{media.type}</td>
                          <td className="px-6 py-4 text-sm max-w-xs truncate">
                            <a
                              href={media.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {media.url}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            {media.type === "image" && media.url && (
                              <div className="w-16 h-16 relative">
                                <img
                                  src={media.url || "/placeholder.svg"}
                                  alt="Media preview"
                                  className="w-16 h-16 object-cover rounded"
                                  onLoad={() => handleImageLoad(media.id)}
                                  onError={() => handleImageError(media.id, media.url)}
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {imageLoadStatus[media.id] === true && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Loaded</span>
                            )}
                            {imageLoadStatus[media.id] === false && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Artwork Records ({artworkRecords.length})</h2>
              {artworkRecords.length === 0 ? (
                <p className="text-red-600">No artwork records found in the database!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {artworkRecords.map((artwork) => (
                        <tr key={artwork.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{artwork.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{artwork.media_id}</td>
                          <td className="px-6 py-4 text-sm max-w-xs truncate">
                            {artwork.media?.url ? (
                              <a
                                href={artwork.media.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {artwork.media.url}
                              </a>
                            ) : (
                              <span className="text-red-600">Missing URL</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {artwork.media?.url && (
                              <div className="w-16 h-16 relative">
                                <img
                                  src={artwork.media.url || "/placeholder.svg"}
                                  alt={artwork.title}
                                  className="w-16 h-16 object-cover rounded"
                                  onLoad={() => handleImageLoad(artwork.id)}
                                  onError={() => handleImageError(artwork.id, artwork.media.url)}
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {imageLoadStatus[artwork.id] === true && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Loaded</span>
                            )}
                            {imageLoadStatus[artwork.id] === false && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                <li>If images fail to load, check if the URLs are accessible by clicking on them</li>
                <li>Make sure your Supabase storage bucket is set to public</li>
                <li>Check if the media_id in artwork records matches an existing media record</li>
                <li>Try using the "artwork" bucket name instead of "artwork-media" in your storage operations</li>
                <li>After fixing issues, use the Refresh Cache button to update your site</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Link href="/admin" className="text-blue-600 hover:underline">
                Back to Admin
              </Link>
              <Link href="/admin/refresh" className="text-blue-600 hover:underline">
                Refresh Cache
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
