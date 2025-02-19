'use client'

import { useAppSelector } from '@/hooks/redux'
import Link from 'next/link'
import { Project } from '@/types'
import OptimizedImage from '@/components/common/OptimizedImage'
import VirtualList from '@/components/common/VirtualList'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'

const ProjectCard = ({ project }: { project: Project }) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  })

  return (
    <article 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 w-full">
        <OptimizedImage
          src={project.image}
          alt={project.title}
          fill
          priority={entry?.isIntersecting}
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/prosjekter/${project.slug}`} className="hover:text-red-600 transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <span
              key={tech}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  const { selectedCategory, isLoading, error } = useAppSelector(state => state.projects)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const filteredProjects = projects.filter(project => 
    !selectedCategory || project.category === selectedCategory
  )

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Ingen prosjekter funnet
        </h2>
        <p className="mt-2 text-gray-600">
          Prøv å velge en annen kategori
        </p>
      </div>
    )
  }

  return (
    <VirtualList
      items={filteredProjects}
      itemHeight={400} // Juster denne verdien basert på faktisk korthøyde
      containerHeight={800} // Juster denne verdien basert på ønsket containerhøyde
      renderItem={(project) => (
        <ProjectCard key={project.id} project={project} />
      )}
    />
  )
}

export default ProjectGrid 