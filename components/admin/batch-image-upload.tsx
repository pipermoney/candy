"use client"

import type React from "react"

import { useState, useRef } from "react"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { Upload, X, Loader2, Check } from "lucide-react"

export default function BatchImageUpload() {
  const [files, setFiles] = useState<File[]>([])

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, { status: string; url?: string; error?: string }>
  >({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (file: File): Promise<{ url: string; mediaId: string }> => {
    const supabase = getSupabaseAdminClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `images/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage.from("artwork").upload(filePath, file)

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("artwork").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL")
    }

    // Get image dimensions
    const dimensions = await getImageDimensions(file)

    // Create media record in database
    const { data: mediaData, error: mediaError } = await supabase
      .from("media")
      .insert({
        url: urlData.publicUrl,
        type: "image",
        alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for alt text
        width: dimensions.width,
        height: dimensions.height,
      })
      .select("id")
      .single()

    if (mediaError) {
      throw new Error(mediaError.message)
    }

    return { url: urlData.publicUrl, mediaId: mediaData.id }
  }

  const handleUploadAll = async () => {
    if (files.length === 0) return

    setUploading(true)
    const progress: Record<string, { status: string; url?: string; error?: string }> = {}

    for (const file of files) {
      const fileId = file.name + file.size // Simple unique identifier
      progress[fileId] = { status: "pending" }
      setUploadProgress({ ...progress })

      try {
        progress[fileId] = { status: "uploading" }
        setUploadProgress({ ...progress })

        const result = await uploadFile(file)

        progress[fileId] = { status: "complete", url: result.url }
        setUploadProgress({ ...progress })
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        progress[fileId] = { status: "error", error: error instanceof Error ? error.message : "Upload failed" }
        setUploadProgress({ ...progress })
      }
    }

    setUploading(false)
  }

  // Helper function to get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const getFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
      case "uploading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "complete":
        return <Check className="w-5 h-5 text-green-500" />
      case "error":
        return <X className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600">Click to upload images</p>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WEBP (max 10MB each)</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{files.length} images selected</h3>
            <button
              onClick={handleUploadAll}
              disabled={uploading}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload All"}
            </button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => {
                    const fileId = file.name + file.size
                    const status = uploadProgress[fileId]?.status || "pending"

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 relative">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getFileSize(file.size)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(status)}
                            <span className="ml-2 text-sm">
                              {status === "error" && uploadProgress[fileId]?.error
                                ? `Error: ${uploadProgress[fileId].error}`
                                : status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {status === "pending" && (
                            <button onClick={() => removeFile(index)} className="text-red-600 hover:text-red-900">
                              Remove
                            </button>
                          )}
                          {status === "complete" && (
                            <a
                              href={uploadProgress[fileId].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
