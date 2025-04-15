"use client"

import { usePathname, useRouter } from "next/navigation"
import { Grid, Maximize } from "lucide-react"

export default function ViewToggle() {
  const pathname = usePathname()
  const router = useRouter()

  const isGridView = pathname === "/grid"

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex border border-black overflow-hidden">
        <button
          onClick={() => router.push("/")}
          className={`px-4 py-2 flex items-center text-sm ${!isGridView ? "bg-black text-white" : "bg-white text-black"}`}
          aria-label="Space view"
        >
          <Maximize className="w-4 h-4 mr-2" />
          SPAZIO
        </button>
        <button
          onClick={() => router.push("/grid")}
          className={`px-4 py-2 flex items-center text-sm ${isGridView ? "bg-black text-white" : "bg-white text-black"}`}
          aria-label="Grid view"
        >
          <Grid className="w-4 h-4 mr-2" />
          GRIGLIA
        </button>
      </div>
    </div>
  )
}
