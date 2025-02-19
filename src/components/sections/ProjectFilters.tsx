interface ProjectFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedTechnologies: string[]
  setSelectedTechnologies: (technologies: string[]) => void
  categories: string[]
  technologies: string[]
}

const ProjectFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTechnologies,
  setSelectedTechnologies,
  categories,
  technologies,
}: ProjectFiltersProps) => {
  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech))
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech])
    }
  }

  return (
    <div className="mb-12 bg-gray-50 rounded-lg p-6">
      {/* Søkefelt */}
      <input
        type="text"
        placeholder="Søk i prosjekter..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-200 mb-6 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
      />

      {/* Kategorifilter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Kategorier</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1 rounded-full transition-colors ${
              selectedCategory === null
                ? 'bg-black text-white'
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
                  ? 'bg-black text-white'
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
              onClick={() => toggleTechnology(tech)}
              className={`px-4 py-1 rounded-full transition-colors ${
                selectedTechnologies.includes(tech)
                  ? 'bg-black text-white'
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

export default ProjectFilters 