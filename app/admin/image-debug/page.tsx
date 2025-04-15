"use client"

import { useState, useEffect } from "react"
import { getSupabaseAdminClient } from "@/lib/supabase"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function ImageDebugPage() {
  const [loading, setLoading] = useState(true)
  const [mediaRecords, setMediaRecords] = useState<any[]>([])
  const [directLoadStatus, setDirectLoadStatus] = useState<Record<string, boolean>>({})
  const [proxyLoadStatus, setProxyLoadStatus] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabaseAdminClient()

        // Fetch media records
        const { data: media, error: mediaError } = await supabase.from("media").select("*").limit(10)

        if (mediaError) throw new Error(`Media fetch error: ${mediaError.message}`)

        setMediaRecords(media || [])
      } catch (err) {
        console.error("Diagnostic error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDirectImageLoad = (id: string) => {
    setDirectLoadStatus((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const handleDirectImageError = (id: string, url: string) => {
    console.error(`Failed to load image directly with ID ${id} from URL: ${url}`)
    setDirectLoadStatus((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  const handleProxyImageLoad = (id: string) => {
    setProxyLoadStatus((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const handleProxyImageError = (id: string, url: string) => {
    console.error(`Failed to load image via proxy with ID ${id} from URL: ${url}`)
    setProxyLoadStatus((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  const testImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok
    } catch (e) {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Advanced Image Diagnostics</h1>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="inline-block w-8 h-8 animate-spin text-gray-400" />
            <p className="mt-2 text-gray-500">Loading diagnostic data...</p>
          </div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direct Load</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proxy Load</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mediaRecords.map((media) => (
                        <tr key={media.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{media.id}</td>
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
                            <div className="flex flex-col items-center">
                              {media.type === "image" && media.url && (
                                <>
                                  <div className="w-16 h-16 relative mb-2">
                                    <img
                                      src={media.url || "/placeholder.svg"}
                                      alt="Direct load"
                                      className="w-16 h-16 object-cover rounded"
                                      onLoad={() => handleDirectImageLoad(media.id)}
                                      onError={() => handleDirectImageError(media.id, media.url)}
                                      crossOrigin="anonymous"
                                    />
                                  </div>
                                  {directLoadStatus[media.id] === true && (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                      Success
                                    </span>
                                  )}
                                  {directLoadStatus[media.id] === false && (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                      Failed
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center">
                              {media.type === "image" && media.url && (
                                <>
                                  <div className="w-16 h-16 relative mb-2">
                                    <img
                                      src={`/api/image-proxy?url=${encodeURIComponent(media.url)}`}
                                      alt="Proxy load"
                                      className="w-16 h-16 object-cover rounded"
                                      onLoad={() => handleProxyImageLoad(media.id)}
                                      onError={() => handleProxyImageError(media.id, media.url)}
                                    />
                                  </div>
                                  {proxyLoadStatus[media.id] === true && (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                      Success
                                    </span>
                                  )}
                                  {proxyLoadStatus[media.id] === false && (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                      Failed
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
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
                <li>If direct loading fails but proxy loading works, it's likely a CORS issue</li>
                <li>If both direct and proxy loading fail, the image might not exist or the URL is incorrect</li>
                <li>Check if your Supabase storage bucket is public and has the correct permissions</li>
                <li>Make sure the image paths in your database match the actual paths in Supabase storage</li>
                <li>Try using the "artwork" bucket name instead of "artwork-media" in your storage operations</li>
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
