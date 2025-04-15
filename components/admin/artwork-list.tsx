"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Artwork } from "@/lib/types"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ArtworkList({ artworks }: { artworks: Artwork[] }) {
  const [items, setItems] = useState(artworks)

  const handleDelete = async (id: string) => {
    // In a real app, this would call an API to delete the artwork
    if (confirm("Are you sure you want to delete this artwork?")) {
      // Mock deletion
      setItems(items.filter((item) => item.id !== id))
      // await deleteArtwork(id)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artwork
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((artwork) => (
            <tr key={artwork.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative w-12 h-12">
                  <Image
                    src={artwork.media.url || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{artwork.title}</div>
                <div className="text-sm text-gray-500">{artwork.slug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(artwork.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Published
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/edit/${artwork.id}`} className="flex items-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(artwork.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
