"use client"

import { useState } from "react"
import { checkImagesInStorage } from "@/lib/check-images"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckImagesPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckImages = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await checkImagesInStorage()
      if (result.success) {
        setResults(result.results)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Check Images in Storage</h1>

        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h2 className="font-medium text-yellow-800 mb-2">About This Tool</h2>
            <p className="text-yellow-700 mb-4">
              This tool will check if the images referenced in your database actually exist in your Supabase storage.
              This can help identify why images aren't displaying correctly.
            </p>
          </div>

          <button
            onClick={handleCheckImages}
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Checking Images...
              </>
            ) : (
              "Check Images in Storage"
            )}
          </button>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

          {results && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Results Summary</h3>
                <p className="text-blue-700">
                  Checked {results.total} images:
                  <span className="ml-2 font-medium text-green-600">{results.accessible} accessible</span>,
                  <span className="ml-2 font-medium text-red-600">{results.inaccessible} inaccessible</span>
                </p>
              </div>

              {results.details && results.details.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.details.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                          <td className="px-6 py-4 text-sm max-w-xs truncate">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {item.url}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.exists ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accessible
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <XCircle className="w-4 h-4 mr-1" />
                                Not Found
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">What to do next?</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                  <li>If images are inaccessible, you may need to re-upload them to your Supabase storage</li>
                  <li>Make sure your Supabase storage bucket is set to public</li>
                  <li>Consider using the manual import or auto-import tools to add new images</li>
                  <li>You can also update the media URLs in your database to point to accessible images</li>
                </ul>
              </div>
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
