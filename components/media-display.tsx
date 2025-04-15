"use client"

import { useState } from "react"
import Image from "next/image"
import type { Media } from "@/lib/types"
import { Play } from "lucide-react"

export default function MediaDisplay({ media }: { media: Media }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [imageError, setImageError] = useState(false)

  // If we don't have media or a URL, show placeholder
  if (!media || !media.url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-sm text-gray-500">No media available</p>
      </div>
    )
  }

  // Handle different media types
  switch (media.type) {
    case "image":
      return (
        <div className="relative w-full h-full">
          {!imageError ? (
            <img
              src={media.url || "/placeholder.svg"}
              alt={media.alt || ""}
              className="object-contain w-full h-full rounded-md"
              onError={() => {
                console.error(`Failed to load image from URL: ${media.url}`)
                setImageError(true)
              }}
            />
          ) : (
            // Fallback to placeholder on error
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Placeholder"
                width={400}
                height={400}
                className="object-cover"
                unoptimized={true}
              />
            </div>
          )}
        </div>
      )

    case "video":
      return (
        <div className="relative w-full h-full rounded-md overflow-hidden">
          {!isPlaying ? (
            <>
              <img
                src={media.thumbnail || "/placeholder.svg?height=400&width=400"}
                alt={media.alt || "Video thumbnail"}
                className="object-cover w-full h-full"
                onError={() => {
                  // If thumbnail fails, use placeholder
                  setImageError(true)
                }}
              />
              {imageError && (
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Placeholder"
                  width={400}
                  height={400}
                  className="object-cover"
                  unoptimized={true}
                />
              )}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
                aria-label="Play video"
              >
                <Play className="w-10 h-10 text-white" />
              </button>
            </>
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={media.thumbnail}
            />
          )}
        </div>
      )

    case "audio":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
          <img
            src={media.thumbnail || "/placeholder.svg?height=400&width=400"}
            alt={media.alt || "Audio thumbnail"}
            className="object-contain w-full h-full"
            onError={() => {
              setImageError(true)
            }}
          />
          {imageError && (
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Placeholder"
              width={400}
              height={400}
              className="object-cover"
              unoptimized={true}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <audio src={media.url} controls className="w-3/4" />
          </div>
        </div>
      )

    default:
      return (
        <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-md">
          <p className="text-sm text-gray-500">Unsupported media type</p>
        </div>
      )
  }
}
