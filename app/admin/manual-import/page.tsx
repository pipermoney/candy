"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface ArtworkInput {
  id: string
  imageUrl: string
  title: string
  category: string
  description: string
}

export default function ManualImportPage() {
  const [artworks, setArtworks] = useState<ArtworkInput[]>([
    {
      id: uuidv4(),
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-05.png-E7k2azVONDIXqR5qEtkKbUjQGML4Pt.jpeg",
      title: "Wooden Crown",
      category: "Cybergirl",
      description: "Portrait on wood, exploring texture and identity.",
    },
    {
      id: uuidv4(),
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-closeup-04.png-TjZZ4fbI90TWrPpbqPckvVgHjp12BL.jpeg",
      title: "Close Encounter",
      category: "Cybergirl",
      description: "Detailed portrait transferred onto wood grain.",
    },
    {
      id: uuidv4(),
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-03-cc4aI0Pzn8XIaOKDFuyrjiiQOsnPsI.png",
      title: "Dice Portrait",
      category: "Portals",
      description: "Portrait with dice element, exploring chance and identity.",
    },
    {
      id: uuidv4(),
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-dicegurl-01-rf9VREj6gmXflWFhHSRBnDgjJ6Hhu0.png",
      title: "Dice Gurl",
      category: "Cybergirl",
      description: "Digital portrait with snake and dice elements.",
    },
    {
      id: uuidv4(),
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-soulofai-ndpRAigRKJ0s5qMGCjj53C07s8mcKs.png",
      title: "Soul of AI",
      category: "Transversive Media",
      description: "Digital collage exploring the intersection of nature, technology, and artificial intelligence.",
    },
  ])

  const [importing, setImporting] = useState(false)
  const [currentArtwork, setCurrentArtwork] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addArtwork = () => {
    setArtworks([
      ...artworks,
      {
        id: uuidv4(),
        imageUrl: "",
        title: "",
        category: "",
        description: "",
      },
    ])
  }

  const removeArtwork = (id: string) => {
    setArtworks(artworks.filter((artwork) => artwork.id !== id))
  }

  const updateArtwork = (id: string, field: keyof ArtworkInput, value: string) => {
    setArtworks(artworks.map((artwork) => (artwork.id === id ? { ...artwork, [field]: value } : artwork)))
  }

  const importArtworks = async () => {
    setImporting(true)
    setError(null)
    setSuccess(null)
    setImportedCount(0)

    try {
      const supabase = getSupabaseBrowserClient()

      // Get categories
      const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, name")

      if (categoriesError) {
        throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
      }

      // Import each artwork one by one
      for (const artwork of artworks) {
        try {
          setCurrentArtwork(artwork.id)

          // Skip if no image URL
          if (!artwork.imageUrl) {
            continue
          }

          // 1. Fetch the image
          const response = await fetch(artwork.imageUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`)
          }

          const imageBlob = await response.blob()

          // 2. Upload to Supabase storage
          const fileExt = artwork.imageUrl.split(".").pop() || "jpg"
          const fileName = `${uuidv4()}.${fileExt}`
          const filePath = `images/${fileName}`

          const { error: uploadError } = await supabase.storage.from("artwork-media").upload(filePath, imageBlob)

          if (uploadError) {
            throw new Error(`Failed to upload image: ${uploadError.message}`)
          }

          // 3. Get public URL
          const { data: urlData } = supabase.storage.from("artwork-media").getPublicUrl(filePath)

          if (!urlData?.publicUrl) {
            throw new Error("Failed to get public URL")
          }

          // 4. Create media record
          const { data: mediaData, error: mediaError } = await supabase
            .from("media")
            .insert({
              url: urlData.publicUrl,
              type: "image",
              alt: artwork.title,
            })
            .select("id")
            .single()

          if (mediaError) {
            throw new Error(`Failed to create media record: ${mediaError.message}`)
          }

          // 5. Find category ID
          const category = categories.find((c) => c.name === artwork.category)
          const categoryId = category?.id || null

          // 6. Create artwork record
          const slug = artwork.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")

          const { error: artworkError } = await supabase.from("artworks").insert({
            title: artwork.title,
            slug,
            description: artwork.description,
            media_id: mediaData.id,
            category_id: categoryId,
            year: new Date().getFullYear().toString(),
          })

          if (artworkError) {
            throw new Error(`Failed to create artwork record: ${artworkError.message}`)
          }

          setImportedCount((prev) => prev + 1)
        } catch (error) {
          console.error(`Error importing artwork ${artwork.title}:`, error)
          // Continue with next artwork instead of stopping the whole process
        }
      }

      setSuccess(`Successfully imported ${importedCount} artworks!`)
    } catch (error) {
      console.error("Import error:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setImporting(false)
      setCurrentArtwork(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Manual Artwork Import</h1>

        <p className="mb-6 text-gray-600">
          This alternative tool lets you manually import artworks one by one. You can edit the details before importing.
        </p>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
        )}

        <div className="space-y-6 mb-8">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Artwork Details</h3>
                <button onClick={() => removeArtwork(artwork.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={artwork.imageUrl}
                    onChange={(e) => updateArtwork(artwork.id, "imageUrl", e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={artwork.title}
                    onChange={(e) => updateArtwork(artwork.id, "title", e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Artwork Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={artwork.category}
                    onChange={(e) => updateArtwork(artwork.id, "category", e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a category</option>
                    <option value="Cybergirl">Cybergirl</option>
                    <option value="Characters">Characters</option>
                    <option value="Play on Space">Play on Space</option>
                    <option value="Portals">Portals</option>
                    <option value="Transversive Media">Transversive Media</option>
                    <option value="Film">Film</option>
                    <option value="Painting">Painting</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={artwork.description}
                    onChange={(e) => updateArtwork(artwork.id, "description", e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={2}
                    placeholder="Artwork description"
                  />
                </div>
              </div>

              {currentArtwork === artwork.id && (
                <div className="mt-2 flex items-center text-blue-600">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </div>
              )}
            </div>
          ))}

          <button onClick={addArtwork} className="flex items-center text-blue-600 hover:text-blue-800">
            <Plus className="w-4 h-4 mr-1" />
            Add Another Artwork
          </button>
        </div>

        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Admin
          </Link>

          <button
            onClick={importArtworks}
            disabled={importing || artworks.length === 0}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {importing ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Importing ({importedCount}/{artworks.length})...
              </>
            ) : (
              "Import Artworks"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
