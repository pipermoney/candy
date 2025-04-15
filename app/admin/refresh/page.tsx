"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { refreshCache } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export default function RefreshPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleRefresh = async () => {
    setRefreshing(true)
    setMessage("Refreshing cache...")

    try {
      // Call the server action to revalidate the cache
      const result = await refreshCache()

      if (result.success) {
        setMessage(`${result.message} Redirecting to home page...`)

        // Force a router refresh as well
        router.refresh()

        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      setMessage(`Error refreshing: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Refresh Server Cache</h1>

        <p className="mb-6 text-gray-600">
          This will clear the server cache and force Next.js to refetch data from Supabase.
        </p>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {refreshing ? (
            <>
              <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
              Refreshing Server Cache...
            </>
          ) : (
            "Refresh Server Cache"
          )}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            Back to Admin
          </Link>
          <Link href="/debug" className="text-sm text-blue-600 hover:underline">
            View Debug Page
          </Link>
        </div>
      </div>
    </div>
  )
}
