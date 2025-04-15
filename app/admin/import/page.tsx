import AdminHeader from "@/components/admin/header"
import ImportArtwork from "@/components/admin/import-artwork"

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Import Artwork</h1>
        <ImportArtwork />
      </main>
    </div>
  )
}
