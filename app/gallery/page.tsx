import { getArtworks } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { refreshCache } from "@/lib/actions"

export default async function GalleryPage() {
  // Force revalidation to get fresh data
  await refreshCache()

  const artworks = await getArtworks()

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Artwork Gallery</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="p-8 text-center bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">No artwork found in your database</h2>
          <p className="mb-6">It looks like you haven't imported any artwork yet. Let's get your artwork displayed!</p>

          <div className="space-y-4">
            <h3 className="font-medium">Import Options:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/manual-import"
                className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium mb-2">Option 1: Manual Import</h4>
                <p className="text-sm text-gray-600">Import artwork one by one with full control over details.</p>
              </Link>

              <Link
                href="/admin/sql-import"
                className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium mb-2">Option 2: SQL Import</h4>
                <p className="text-sm text-gray-600">Use SQL commands to directly insert artwork into your database.</p>
              </Link>

              <Link
                href="/admin/diagnose"
                className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium mb-2">Option 3: Diagnose Issues</h4>
                <p className="text-sm text-gray-600">Run diagnostics to identify and fix any setup problems.</p>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <Link key={artwork.id} href={`/artwork/${artwork.slug}`} className="block group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={artwork.media.url || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{artwork.title}</h2>
                  {artwork.category && (
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-gray-100 rounded-full">
                      {artwork.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
