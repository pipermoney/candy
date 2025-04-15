"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Plus, FileText } from "lucide-react"

export default function BatchUploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [metadataFile, setMetadataFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleMetadataFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMetadataFile(e.target.files[0])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("Please upload at least one file")
      return
    }

    if (!metadataFile) {
      alert("Please upload a metadata CSV file")
      return
    }

    setUploading(true)

    try {
      // In a real app, this would:
      // 1. Parse the CSV file
      // 2. Match metadata with uploaded files
      // 3. Upload files to storage
      // 4. Create artwork entries in CMS

      // Mock upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to admin dashboard after successful upload
      router.push("/admin")
    } catch (error) {
      console.error("Batch upload error:", error)
      alert("An error occurred during batch upload")
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Metadata CSV File</label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            <input
              type="file"
              onChange={handleMetadataFileChange}
              accept=".csv"
              className="hidden"
              id="metadata-upload"
            />

            {metadataFile ? (
              <div className="w-full flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-sm truncate max-w-xs">{metadataFile.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({(metadataFile.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button type="button" onClick={() => setMetadataFile(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="metadata-upload"
                className="flex flex-col items-center justify-center py-4 cursor-pointer text-gray-600 hover:text-gray-900"
              >
                <FileText className="w-10 h-10 mb-2 text-gray-400" />
                <span className="text-sm font-medium">Click to upload metadata CSV file</span>
                <span className="text-xs text-gray-500 mt-1">
                  CSV file with columns: filename, title, description, year, etc.
                </span>
              </label>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            <p>CSV file should have the following columns:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>filename - must match the uploaded file name</li>
              <li>title - artwork title</li>
              <li>description - artwork description</li>
              <li>year - year created</li>
              <li>medium - artwork medium</li>
              <li>dimensions - artwork dimensions</li>
            </ul>
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
                <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, MP3, WAV, MP4, MPEG (max 50MB each)</span>
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
            disabled={uploading || files.length === 0 || !metadataFile}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Batch Upload"}
          </button>
        </div>
      </form>
    </div>
  )
}
