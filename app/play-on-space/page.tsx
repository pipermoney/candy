import { Suspense } from "react"
import Header from "@/components/header"
import { getArtworks } from "@/lib/api"
import ScrollReveal from "@/components/scroll-reveal"
import MediaDisplay from "@/components/media-display"
import Link from "next/link"

export default async function PlayOnSpacePage() {
  const allArtworks = await getArtworks()
  const playOnSpaceArtworks = allArtworks.filter((artwork) => artwork.category === "Play on Space")

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
        <ScrollReveal>
          <h1 className="text-3xl font-light mb-4">Play on Space</h1>
          <p className="text-lg text-gray-600 mb-12">
            A collection exploring the intersection of physical and conceptual space through photography and film.
          </p>
        </ScrollReveal>

        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {playOnSpaceArtworks.map((artwork, index) => (
              <ScrollReveal key={artwork.id} delay={index * 0.1}>
                <Link href={`/artwork/${artwork.slug}`} className="block">
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden">
                    <MediaDisplay media={artwork.media} />
                  </div>
                  <h2 className="text-lg font-light">{artwork.title}</h2>
                  {artwork.year && <p className="text-sm text-gray-400">{artwork.year}</p>}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Suspense>
      </div>
    </main>
  )
}
