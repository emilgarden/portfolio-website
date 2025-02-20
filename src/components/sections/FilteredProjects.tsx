'use client'

import { useState } from 'react'
import ProjectGrid from './ProjectGrid'
import ProjectFilters from './ProjectFilters'
import { Project } from '@/types/project'

export default function FilteredProjects({ 
  projects,
  categories,
  technologies 
}: { 
  projects: Project[]
  categories: string[]
  technologies: string[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])

  const filteredProjects = projects.filter(project => {
    // Søkefilter
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    
    // Kategorifilter
    const matchesCategory = !selectedCategory || project.category === selectedCategory
    
    // Teknologifilter
    const matchesTechnologies = 
      selectedTechnologies.length === 0 ||
      selectedTechnologies.every(tech => project.technologies?.includes(tech))
    
    return matchesSearch && matchesCategory && matchesTechnologies
  })

  return (
    <div>
      <ProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTechnologies={selectedTechnologies}
        setSelectedTechnologies={setSelectedTechnologies}
        categories={categories}
        technologies={technologies}
      />
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
} 