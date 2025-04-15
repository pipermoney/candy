import Link from "next/link"

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 overflow-x-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="font-medium whitespace-nowrap">
            Admin Dashboard
          </Link>

          <nav className="flex-1 overflow-x-auto">
            <ul className="flex space-x-4 md:space-x-6 px-2">
              <li className="whitespace-nowrap">
                <Link href="/admin" className="text-sm hover:underline">
                  Artworks
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/add" className="text-sm hover:underline">
                  Add Artwork
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/auto-import" className="text-sm hover:underline">
                  Auto Import
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/fix-all-images" className="text-sm hover:underline font-bold text-red-600">
                  Fix All Images
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/import" className="text-sm hover:underline">
                  Import
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/import-transversive-media" className="text-sm hover:underline font-bold">
                  Import Transversive Media
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/manual-import" className="text-sm hover:underline">
                  Manual Import
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/sql-import" className="text-sm hover:underline">
                  SQL Import
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/diagnose" className="text-sm hover:underline">
                  Diagnose
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/diagnose-images" className="text-sm hover:underline">
                  Diagnose Images
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/test-images" className="text-sm hover:underline">
                  Test Images
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/setup" className="text-sm hover:underline">
                  Setup
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/debug" className="text-sm hover:underline">
                  Debug
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/refresh" className="text-sm hover:underline">
                  Refresh
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/" className="text-sm hover:underline">
                  View Site
                </Link>
              </li>
              <li className="whitespace-nowrap">
                <Link href="/admin/local-data-info" className="text-sm hover:underline font-bold text-green-600">
                  Local Data Info
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
