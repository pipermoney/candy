export type MediaType = "image" | "video" | "audio"

export interface Media {
  id: string
  url: string
  type: MediaType
  alt?: string
  thumbnail?: string
  width?: number
  height?: number
}

export interface Artwork {
  id: string
  title: string
  slug: string
  description: string
  media: Media
  year?: string
  category?: string
  details?: Record<string, string>
  createdAt: string
  updatedAt: string
}
