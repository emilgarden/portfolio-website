interface ProjectFiltersProps {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedTechnologies: string[]
  setSelectedTechnologies: (technologies: string[]) => void
  categories: string[]
  technologies: string[]
}

export default function ProjectFilters({
  selectedCategory,
  setSelectedCategory,
  selectedTechnologies,
  setSelectedTechnologies,
  categories,
  technologies,
}: ProjectFiltersProps) {
  return (
    <div className="mb-12 bg-gray-50 rounded-lg p-6">
      {/* Kategorifilter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Kategorier</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1 rounded-full transition-colors ${
              selectedCategory === null
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Alle
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Teknologifilter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Teknologier</h3>
        <div className="flex flex-wrap gap-2">
          {technologies.map(tech => (
            <button
              key={tech}
              onClick={() => {
                if (selectedTechnologies.includes(tech)) {
                  setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech))
                } else {
                  setSelectedTechnologies([...selectedTechnologies, tech])
                }
              }}
              className={`px-4 py-1 rounded-full transition-colors ${
                selectedTechnologies.includes(tech)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 