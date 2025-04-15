"use client"

import type React from "react"

import { useState, useRef } from "react"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onUploadComplete: (url: string, mediaId: string) => void
  mediaType?: "image" | "video" | "audio"
}

export default function ImageUpload({ onUploadComplete, mediaType = "image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (mediaType === "image" && !file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    } else if (mediaType === "video" && !file.type.startsWith("video/")) {
      setError("Please select a video file")
      return
    } else if (mediaType === "audio" && !file.type.startsWith("audio/")) {
      setError("Please select an audio file")
      return
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setError(null)

    // Upload to Supabase
    await handleUpload(file)

    // Clean up preview URL
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      const supabase = getSupabaseAdminClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${mediaType}s/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("artwork").upload(filePath, file)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("artwork").getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL")
      }

      // Create media record in database
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .insert({
          url: urlData.publicUrl,
          type: mediaType,
          alt: file.name,
          width: mediaType === "image" ? await getImageDimensions(file).then((dim) => dim.width) : undefined,
          height: mediaType === "image" ? await getImageDimensions(file).then((dim) => dim.height) : undefined,
        })
        .select("id")
        .single()

      if (mediaError) {
        throw new Error(mediaError.message)
      }

      // Call the callback with the URL and media ID
      onUploadComplete(urlData.publicUrl, mediaData.id)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during upload")
    } finally {
      setUploading(false)
    }
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

  const handleRemovePreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={mediaType === "image" ? "image/*" : mediaType === "video" ? "video/*" : "audio/*"}
          />
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600">Click to upload {mediaType}</p>
          <p className="text-xs text-gray-500 mt-1">
            {mediaType === "image"
              ? "JPG, PNG, GIF, WEBP (max 10MB)"
              : mediaType === "video"
                ? "MP4, WEBM, MOV (max 100MB)"
                : "MP3, WAV, OGG (max 20MB)"}
          </p>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          {mediaType === "image" && <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-auto" />}
          {mediaType === "video" && <video src={preview} controls className="w-full h-auto" />}
          {mediaType === "audio" && (
            <div className="bg-gray-100 p-4 flex items-center justify-center">
              <audio src={preview} controls className="w-full" />
            </div>
          )}

          {uploading ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <button
              onClick={handleRemovePreview}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
