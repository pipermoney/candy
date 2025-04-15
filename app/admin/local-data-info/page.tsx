import Link from "next/link"
import AdminHeader from "@/components/admin/header"

export default function LocalDataInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Local Data Workaround</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="prose max-w-none">
            <h2>How This Workaround Works</h2>
            <p>
              Since Supabase isn't working properly, we've implemented a local data solution that doesn't rely on any
              database connections. Here's how it works:
            </p>

            <ul>
              <li>
                All artwork data is stored in a local TypeScript file (<code>lib/local-data.ts</code>)
              </li>
              <li>
                The API functions (<code>getArtworks</code>, <code>getArtwork</code>, etc.) now use this local data
              </li>
              <li>All 10 Transversive Media artworks are included with their direct image URLs</li>
              <li>The site functions exactly the same, but without any database dependencies</li>
            </ul>

            <h2>Benefits of This Approach</h2>
            <ul>
              <li>No database connection required</li>
              <li>Fast loading times (no API calls)</li>
              <li>Consistent behavior across environments</li>
              <li>Easy to update by editing the local data file</li>
            </ul>

            <h2>Viewing Your Artworks</h2>
            <p>
              You can now view your Transversive Media collection on the dedicated page or mixed with other artworks in
              the main gallery views:
            </p>

            <div className="flex flex-col space-y-4 mt-6">
              <Link href="/transversive-media" className="px-4 py-2 bg-black text-white text-center rounded">
                View Transversive Media Collection
              </Link>
              <Link href="/grid" className="px-4 py-2 bg-gray-200 text-black text-center rounded">
                View Grid Gallery
              </Link>
              <Link href="/" className="px-4 py-2 bg-gray-200 text-black text-center rounded">
                View Home Page
              </Link>
            </div>

            <h2 className="mt-8">Adding More Artworks</h2>
            <p>
              To add more artworks, you can edit the <code>lib/local-data.ts</code> file and add new entries to the
              arrays. The format follows the same structure as the existing artworks.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
