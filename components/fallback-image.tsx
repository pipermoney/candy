"use client"

import { useState } from "react"
import Image from "next/image"

interface FallbackImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
}

export default function FallbackImage({ src, alt, width, height, fill = false, className = "" }: FallbackImageProps) {
  const [error, setError] = useState(false)

  return (
    <>
      {!error ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          className={className}
          unoptimized={true}
          onError={() => setError(true)}
        />
      ) : (
        <Image
          src="/placeholder.svg?height=400&width=400"
          alt={`Placeholder for ${alt}`}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          className={className}
          unoptimized={true}
        />
      )}
    </>
  )
}
