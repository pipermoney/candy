"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function SetupPage() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const setupStorage = async () => {
    setLoading(true)
    setMessage("")

    try {
      const supabase = getSupabaseBrowserClient()

      // Create storage bucket if it doesn't exist
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) throw new Error(bucketsError.message)

      const bucketExists = buckets.some((bucket) => bucket.name === "artwork")

      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket("artwork", {
          public: true,
          fileSizeLimit: 100000000, // 100MB
        })

        if (createError) throw new Error(createError.message)
      }

      // Seed categories
      const categoriesResponse = await fetch("/admin/seed/categories", {
        method: "POST",
      })

      if (!categoriesResponse.ok) {
        throw new Error("Failed to seed categories")
      }

      setMessage("Setup completed successfully!")
    } catch (error) {
      console.error("Setup error:", error)
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Initial Setup</h1>
        <p className="mb-6 text-gray-600">
          This will set up the necessary storage buckets and seed initial data for your portfolio site.
        </p>

        <button
          onClick={setupStorage}
          disabled={loading}
          className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Run Setup"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${message.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>This will:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Create an "artwork-media" storage bucket</li>
            <li>Seed initial categories</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
