import { Suspense } from "react"
import GridGallery from "@/components/grid-gallery"
import Header from "@/components/header"
import ViewToggle from "@/components/view-toggle"
import { getArtworks } from "@/lib/api"

export default async function GridView() {
  const artworks = await getArtworks()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <GridGallery artworks={artworks} />
      </Suspense>
      <ViewToggle />
    </main>
  )
}
