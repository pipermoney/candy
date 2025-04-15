"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Plus } from "lucide-react"
import type { MediaType } from "@/lib/types"

export default function UploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    medium: "",
    dimensions: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("Please upload at least one file")
      return
    }

    setUploading(true)

    try {
      // In a real app, this would upload files to your storage service
      // and create artwork entries in your CMS

      // Mock upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to admin dashboard after successful upload
      router.push("/admin")
    } catch (error) {
      console.error("Upload error:", error)
      alert("An error occurred during upload")
    } finally {
      setUploading(false)
    }
  }

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️"
    if (file.type.startsWith("video/")) return "🎬"
    if (file.type.startsWith("audio/")) return "🎵"
    return "📄"
  }

  const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "image" // Default fallback
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
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
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Media Files</label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
            />

            {files.length > 0 ? (
              <div className="w-full space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">{getFileTypeIcon(file)}</span>
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                      <span className="ml-2 text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Files
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center py-6 text-gray-600 hover:text-gray-900"
              >
                <Upload className="w-12 h-12 mb-2 text-gray-400" />
                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, MP3, WAV, MP4, MPEG (max 50MB)</span>
              </button>
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
            disabled={uploading}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  )
}
