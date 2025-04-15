import { notFound } from "next/navigation"
import { getArtwork } from "@/lib/api"
import Header from "@/components/header"
import ScrollReveal from "@/components/scroll-reveal"
import CloseButton from "@/components/close-button"

export default async function ArtworkPage({ params }: { params: { slug: string } }) {
  const artwork = await getArtwork(params.slug)

  if (!artwork) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CloseButton />

      <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl">
        <ScrollReveal>
          <div className="w-full mb-12 flex justify-center">
            <div className="max-w-full max-h-[80vh] relative">
              {artwork.media.type === "video" ? (
                <video
                  src={artwork.media.url}
                  controls
                  className="max-h-[80vh] w-auto"
                  poster={artwork.media.thumbnail}
                />
              ) : (
                <img
                  src={artwork.media.url || "/placeholder.svg"}
                  alt={artwork.title}
                  className="object-contain max-h-[80vh] w-auto"
                />
              )}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-12">
          <ScrollReveal delay={0.2}>
            <div>
              <h1 className="text-2xl font-light mb-2">{artwork.title}</h1>
              {artwork.year && <p className="text-gray-400">{artwork.year}</p>}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: artwork.description }} />
          </ScrollReveal>

          {artwork.details && (
            <ScrollReveal delay={0.4}>
              <div>
                <dl className="space-y-4">
                  {Object.entries(artwork.details).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm text-gray-400 uppercase">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </main>
  )
}
