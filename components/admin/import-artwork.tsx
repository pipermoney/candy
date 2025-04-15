"use client"

import { useState } from "react"
import { uploadImageFromUrl, createMediaRecord } from "@/lib/upload-images"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface ImageToImport {
  name: string
  url: string
  category?: string
  title?: string
  description?: string
}

export default function ImportArtwork() {
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Sample images from your collection
  const imagesToImport: ImageToImport[] = [
    {
      name: "character-slicesofme.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-slicesofme-QAaOiNl2LV4N5oQViIF9bgCOvCwF6J.png",
      category: "Characters",
      title: "Slices of Me",
      description: "A study of movement and form through silhouettes.",
    },
    {
      name: "character-05.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-05.png-E7k2azVONDIXqR5qEtkKbUjQGML4Pt.jpeg",
      category: "Cybergirl",
      title: "Wooden Crown",
      description: "Portrait on wood, exploring texture and identity.",
    },
    {
      name: "character-closeup-04.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-closeup-04.png-TjZZ4fbI90TWrPpbqPckvVgHjp12BL.jpeg",
      category: "Cybergirl",
      title: "Close Encounter",
      description: "Detailed portrait transferred onto wood grain.",
    },
    {
      name: "character-03.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-03-cc4aI0Pzn8XIaOKDFuyrjiiQOsnPsI.png",
      category: "Portals",
      title: "Dice Portrait",
      description: "Portrait with dice element, exploring chance and identity.",
    },
    {
      name: "character-dicegurl-01.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-dicegurl-01-rf9VREj6gmXflWFhHSRBnDgjJ6Hhu0.png",
      category: "Cybergirl",
      title: "Dice Gurl",
      description: "Digital portrait with snake and dice elements.",
    },
    {
      name: "character-soulofai.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-soulofai-ndpRAigRKJ0s5qMGCjj53C07s8mcKs.png",
      category: "Transversive Media",
      title: "Soul of AI",
      description: "Digital collage exploring the intersection of nature, technology, and artificial intelligence.",
    },
    {
      name: "character-02.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-02-siN1tEU6KEowjTJNMsACBQa2KRPmH8.png",
      category: "Cybergirl",
      title: "Aggressive",
      description: "Blue-toned portrait with 3D typography.",
    },
    {
      name: "character-08.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-08-ItNZcHjwVbSAxxaMTnBT8bzUkSkcp6.png",
      category: "Play on Space",
      title: "Red Distortion",
      description: "Abstract digital artwork exploring form and color.",
    },
    {
      name: "character-04.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-04-xZavvE8Hu7qgtMB9B4L7ymZRGlVrrx.png",
      category: "Characters",
      title: "Crown Bearer",
      description: "Digital portrait with medieval elements and vibrant orange hair.",
    },
  ]

  // Generate a unique slug
  const generateUniqueSlug = (baseSlug: string): string => {
    // Add a timestamp and random number to ensure uniqueness
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    return `${baseSlug}-${timestamp}-${randomNum}`
  }

  const importImages = async () => {
    setImporting(true)
    setError(null)
    const newProgress = { ...progress }
    const newCompleted: string[] = []

    try {
      const supabase = getSupabaseAdminClient()

      for (const image of imagesToImport) {
        try {
          // Update progress
          newProgress[image.name] = "Uploading to storage..."
          setProgress({ ...newProgress })

          // Upload image to storage
          const uploadResult = await uploadImageFromUrl(image.url, image.name)

          // Update progress
          newProgress[image.name] = "Creating media record..."
          setProgress({ ...newProgress })

          // Create media record
          const mediaId = await createMediaRecord(uploadResult.url, "image", image.title || image.name)

          // Update progress
          newProgress[image.name] = "Creating artwork record..."
          setProgress({ ...newProgress })

          // Create base slug
          const baseSlug = image.title
            ? image.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
            : image.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")

          // Generate unique slug
          const slug = generateUniqueSlug(baseSlug)

          // Get category ID
          let categoryId = null
          if (image.category) {
            const { data: categoryData } = await supabase
              .from("categories")
              .select("id")
              .eq("name", image.category)
              .single()

            if (categoryData) {
              categoryId = categoryData.id
            }
          }

          // Create artwork
          const { error: artworkError } = await supabase.from("artworks").insert({
            title: image.title || image.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
            slug,
            description: image.description || "",
            media_id: mediaId,
            category_id: categoryId,
            year: new Date().getFullYear().toString(),
          })

          if (artworkError) throw artworkError

          // Mark as completed
          newProgress[image.name] = "Completed"
          newCompleted.push(image.name)
        } catch (err) {
          console.error(`Error importing ${image.name}:`, err)
          newProgress[image.name] = `Error: ${err instanceof Error ? err.message : "Unknown error"}`
        }
      }

      setCompleted(newCompleted)
    } catch (err) {
      console.error("Import error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Import Artwork Images</h2>
        <p className="mb-4 text-gray-600">
          This will import the images you've shared into your Supabase storage and create artwork records for them.
        </p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <button
          onClick={importImages}
          disabled={importing}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {importing ? (
            <>
              <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            "Import Images"
          )}
        </button>

        {Object.keys(progress).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Import Progress</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {imagesToImport.map((image) => (
                    <tr key={image.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.name}
                              className="h-10 w-10 object-cover rounded"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{image.title || image.name}</div>
                            <div className="text-sm text-gray-500">{image.category || "Uncategorized"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            progress[image.name]?.startsWith("Error")
                              ? "bg-red-100 text-red-800"
                              : progress[image.name] === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {progress[image.name] || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            Successfully imported {completed.length} of {imagesToImport.length} images!
          </div>
        )}
      </div>
    </div>
  )
}
