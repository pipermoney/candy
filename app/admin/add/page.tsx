import AdminHeader from "@/components/admin/header"
import ArtworkForm from "@/components/admin/artwork-form"
import { getCategories } from "@/lib/api"

export default async function AddArtworkPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Add New Artwork</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <ArtworkForm categories={categories} />
        </div>
      </main>
    </div>
  )
}
