"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import ImageUpload from "./image-upload"

interface Category {
  id: string
  name: string
  slug: string
}

interface ArtworkFormProps {
  categories: Category[]
}

export default function ArtworkForm({ categories }: ArtworkFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaId, setMediaId] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    medium: "",
    dimensions: "",
    categoryId: "",
  })
  const [details, setDetails] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDetailChange = (index: number, field: "key" | "value", value: string) => {
    setDetails((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addDetailField = () => {
    setDetails((prev) => [...prev, { key: "", value: "" }])
  }

  const removeDetailField = (index: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadComplete = (url: string, id: string) => {
    setMediaUrl(url)
    setMediaId(id)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mediaId) {
      alert("Please upload an image first")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Create artwork
      const { data: artwork, error: artworkError } = await supabase
        .from("artworks")
        .insert({
          title: formData.title,
          slug: generateSlug(formData.title),
          description: formData.description,
          year: formData.year,
          medium: formData.medium,
          dimensions: formData.dimensions,
          category_id: formData.categoryId || null,
          media_id: mediaId,
        })
        .select("id")
        .single()

      if (artworkError) throw new Error(artworkError.message)

      // Add details if any
      const validDetails = details.filter((d) => d.key && d.value)

      if (validDetails.length > 0) {
        const detailsToInsert = validDetails.map((d) => ({
          artwork_id: artwork.id,
          key: d.key,
          value: d.value,
        }))

        const { error: detailsError } = await supabase.from("artwork_details").insert(detailsToInsert)

        if (detailsError) throw new Error(detailsError.message)
      }

      // Redirect to admin dashboard
      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Error submitting artwork:", error)
      alert("An error occurred while saving the artwork")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="medium" className="block text-sm font-medium text-gray-700">
                Medium
              </label>
              <input
                type="text"
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                Dimensions
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>

            {details.map((detail, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={detail.key}
                  onChange={(e) => handleDetailChange(index, "key", e.target.value)}
                  className="w-1/3 border border-gray-300 rounded-md shadow-sm p-2"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={detail.value}
                  onChange={(e) => handleDetailChange(index, "value", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                />
                <button type="button" onClick={() => removeDetailField(index)} className="p-2 text-red-500">
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addDetailField} className="text-sm text-blue-600 hover:text-blue-800">
              + Add Detail
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Artwork Image *</label>
          <ImageUpload onUploadComplete={handleUploadComplete} />

          {mediaUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Image uploaded successfully!</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !mediaId}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Artwork"}
        </button>
      </div>
    </form>
  )
}
