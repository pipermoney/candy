import { Suspense } from "react"
import FloatingGallery from "@/components/floating-gallery"
import Header from "@/components/header"
import { getArtworks } from "@/lib/api"

export default async function Home() {
  const artworks = await getArtworks()

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <FloatingGallery artworks={artworks} />
      </Suspense>
    </main>
  )
}
