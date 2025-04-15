import AdminHeader from "@/components/admin/header"
import ArtworkList from "@/components/admin/artwork-list"
import { getArtworks } from "@/lib/api"

export default async function AdminPage() {
  // In a real app, you would check authentication here
  // If not authenticated, redirect to login
  // const isAuthenticated = await checkAuth()
  // if (!isAuthenticated) redirect('/admin/login')

  const artworks = await getArtworks()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">Artworks</h1>
          <a href="/admin/upload" className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors">
            Upload New
          </a>
        </div>

        <ArtworkList artworks={artworks} />
      </main>
    </div>
  )
}
