import { getArtworks } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { refreshCache } from "@/lib/actions"

export default async function DebugPage() {
  const artworks = await getArtworks()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug: Artworks in Database</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <p>Found {artworks.length} artworks in the database</p>
        <form action={refreshCache}>
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Refresh Cache Now
          </button>
        </form>
      </div>

      {artworks.length === 0 ? (
        <div className="p-8 text-center bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">No artworks found</h2>
          <p className="mb-4">It looks like there are no artworks in your database yet.</p>
          <Link href="/admin/import" className="text-blue-600 underline">
            Go to Import Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={artwork.media.url || "/placeholder.svg"}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{artwork.title}</h2>
                <p className="text-sm text-gray-500">{artwork.category || "No category"}</p>
                <p className="text-xs mt-2 text-gray-400">ID: {artwork.id}</p>
                <p className="text-xs text-gray-400">Media ID: {artwork.media.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/admin" className="text-blue-600 underline">
          Back to Admin
        </Link>
      </div>
    </div>
  )
}
