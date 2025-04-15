"use client"

import { useState } from "react"
import { importTransversiveMediaArtworks } from "@/lib/import-transversive-media"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import AdminHeader from "@/components/admin/header"

export default function ImportTransversiveMediaPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImport = async () => {
    setLoading(true)
    try {
      const result = await importTransversiveMediaArtworks()
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
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Import Transversive Media Artworks</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Transversive Media Collection</h2>

          <p className="mb-6 text-gray-600">
            This will import the Transversive Media collection of 10 textile prints into your portfolio. The images will
            be added directly from their source URLs.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_01-Art7dNc8RrvsAQS5jeaMkVe1Vkp67S.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_02-BpuEucL2hdpXprMgnxbiVVAL7b3hgi.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_03-itixc1055cFRCznqDNqesnyemRMJLz.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_04-w0Y9Mca4xJ1kGi33nkaUEQefPT3aBi.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_05-zvOyYye5JuRAJfsSdlapMfTgifT02s.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_06-tQ562maU2LYxgS9YPven1QIBpOzU46.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_07-zpPGGDiiBNaJkpt0wqxytlic8LUmRR.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_08-M5oZrFwN56AdlwNj89CRW4an3bktOG.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_09-3ZSA2oYciv2RQX47hIXgaBfpyOPr0A.png",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transversivemedia_10-rZ5CQIKoolHFrCpvCRsm5LdiG8L0C4.png",
            ].map((url, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded border">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Transversive Media ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleImport}
            disabled={loading}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Collection"
            )}
          </button>

          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              <h3 className="font-medium">{result.success ? "Import Successful" : "Import Failed"}</h3>
              <p className="mt-1">{result.message}</p>

              {result.results?.errors?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    {result.results.errors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                    {result.results.errors.length > 5 && <li>...and {result.results.errors.length - 5} more errors</li>}
                  </ul>
                </div>
              )}

              {result.success && (
                <div className="mt-4">
                  <Link href="/grid" className="text-blue-600 hover:underline">
                    View in Grid Gallery
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
