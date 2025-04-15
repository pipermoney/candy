"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function DiagnosePage() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({})
  const [overallStatus, setOverallStatus] = useState<"idle" | "success" | "error">("idle")

  const runDiagnostics = async () => {
    setRunning(true)
    setResults({})
    const newResults: Record<string, { success: boolean; message: string }> = {}
    let hasErrors = false

    try {
      const supabase = getSupabaseBrowserClient()

      // Test 1: Check Supabase connection
      try {
        newResults["connection"] = { success: false, message: "Testing connection..." }
        setResults({ ...newResults })

        const { data, error } = await supabase.from("categories").select("count").single()

        if (error) throw error

        newResults["connection"] = {
          success: true,
          message: "Successfully connected to Supabase!",
        }
      } catch (error) {
        hasErrors = true
        newResults["connection"] = {
          success: false,
          message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
      setResults({ ...newResults })

      // Test 2: Check storage bucket
      try {
        newResults["storage"] = { success: false, message: "Checking storage bucket..." }
        setResults({ ...newResults })

        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

        if (bucketsError) throw bucketsError

        const artworkBucket = buckets.find((bucket) => bucket.name === "artwork")

        if (!artworkBucket) {
          throw new Error("artwork bucket not found")
        }

        newResults["storage"] = {
          success: true,
          message: "Storage bucket 'artwork' exists!",
        }
      } catch (error) {
        hasErrors = true
        newResults["storage"] = {
          success: false,
          message: `Storage error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
      setResults({ ...newResults })

      // Test 3: Check required tables
      try {
        newResults["tables"] = { success: false, message: "Checking database tables..." }
        setResults({ ...newResults })

        // Check artworks table
        const { error: artworksError } = await supabase.from("artworks").select("count").limit(1)
        if (artworksError) throw new Error(`artworks table: ${artworksError.message}`)

        // Check media table
        const { error: mediaError } = await supabase.from("media").select("count").limit(1)
        if (mediaError) throw new Error(`media table: ${mediaError.message}`)

        // Check categories table
        const { error: categoriesError } = await supabase.from("categories").select("count").limit(1)
        if (categoriesError) throw new Error(`categories table: ${categoriesError.message}`)

        newResults["tables"] = {
          success: true,
          message: "All required database tables exist!",
        }
      } catch (error) {
        hasErrors = true
        newResults["tables"] = {
          success: false,
          message: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
      setResults({ ...newResults })

      // Test 4: Check storage permissions
      try {
        newResults["permissions"] = { success: false, message: "Checking storage permissions..." }
        setResults({ ...newResults })

        // Try to upload a small test file
        const testData = new Blob(["test"], { type: "text/plain" })
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("artwork")
          .upload(`test-${Date.now()}.txt`, testData, { upsert: true })

        if (uploadError) throw uploadError

        newResults["permissions"] = {
          success: true,
          message: "Storage permissions are correct!",
        }
      } catch (error) {
        hasErrors = true
        newResults["permissions"] = {
          success: false,
          message: `Permission error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
      setResults({ ...newResults })

      // Test 5: Check image fetch capability
      try {
        newResults["fetch"] = { success: false, message: "Testing image fetch capability..." }
        setResults({ ...newResults })

        // Try to fetch one of the images
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-05.png-E7k2azVONDIXqR5qEtkKbUjQGML4Pt.jpeg",
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()

        if (blob.size === 0) {
          throw new Error("Fetched image has zero size")
        }

        newResults["fetch"] = {
          success: true,
          message: "Successfully fetched test image!",
        }
      } catch (error) {
        hasErrors = true
        newResults["fetch"] = {
          success: false,
          message: `Fetch error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
      setResults({ ...newResults })

      setOverallStatus(hasErrors ? "error" : "success")
    } catch (error) {
      console.error("Diagnostic error:", error)
      setOverallStatus("error")
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Supabase Diagnostics</h1>

        <p className="mb-6 text-gray-600">
          This tool will check your Supabase connection and setup to help diagnose import issues.
        </p>

        <button
          onClick={runDiagnostics}
          disabled={running}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {running ? (
            <>
              <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </button>

        {Object.keys(results).length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Diagnostic Results</h2>

            {Object.entries(results).map(([test, result]) => (
              <div
                key={test}
                className={`p-4 rounded-lg ${
                  result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-medium capitalize">{test}</h3>
                    <p className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {overallStatus !== "idle" && (
              <div className={`p-4 rounded-lg ${overallStatus === "success" ? "bg-green-100" : "bg-red-100"}`}>
                <h3 className="font-bold">{overallStatus === "success" ? "All tests passed!" : "Some tests failed"}</h3>
                <p className="mt-2">
                  {overallStatus === "success"
                    ? "Your Supabase setup looks good. Try the import tool again."
                    : "Please fix the issues above before trying the import tool again."}
                </p>

                {overallStatus === "error" && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
                    <h4 className="font-medium">Troubleshooting Steps:</h4>
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Make sure you've run the setup page first (/admin/setup)</li>
                      <li>Check your Supabase credentials in your environment variables</li>
                      <li>Verify that your Supabase project is active and not paused</li>
                      <li>Try running the setup again to create missing tables or buckets</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Admin
          </Link>
          <Link href="/admin/setup" className="text-blue-600 hover:underline">
            Go to Setup Page
          </Link>
        </div>
      </div>
    </div>
  )
}
