"use client"

// Define the categories as specified
const categories = ["Cybergirl", "Characters", "Play on Space", "Portals", "Transversive Media", "Film", "Painting"]

interface CategoryFilterProps {
  selectedCategories: string[]
  onSelectCategory: (category: string) => void
  onClearCategory: (category: string) => void
  onClearAll: () => void
}

export default function CategoryFilter({
  selectedCategories,
  onSelectCategory,
  onClearCategory,
  onClearAll,
}: CategoryFilterProps) {
  return (
    <div className="fixed top-20 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm py-3 px-6">
      <div className="flex flex-wrap gap-2 items-center justify-center max-w-[1800px] mx-auto">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <button
              key={category}
              onClick={() => (isSelected ? onClearCategory(category) : onSelectCategory(category))}
              className={`text-xs px-4 py-1.5 rounded-full transition-all border ${
                isSelected
                  ? "bg-black text-white border-black transform scale-105"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
