import AdminHeader from "@/components/admin/header"
import UploadForm from "@/components/admin/upload-form"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-8">Upload Artwork</h1>
        <UploadForm />
      </main>
    </div>
  )
}
