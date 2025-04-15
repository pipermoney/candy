import AdminHeader from "@/components/admin/header"
import BatchImageUpload from "@/components/admin/batch-image-upload"

export default function BatchUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Batch Upload Images</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-6 text-gray-600">
            Upload multiple images at once to your Supabase storage. After uploading, you can assign metadata to these
            images from the admin dashboard.
          </p>
          <BatchImageUpload />
        </div>
      </main>
    </div>
  )
}
