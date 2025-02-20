'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import ProjectCard from '../common/ProjectCard'
import { Project } from '@/types/project'

const ProjectsSection = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const supabase = createClientComponentClient()
      
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('sort_order', { ascending: true })
        .limit(3)
      
      if (error) {
        console.error('Error fetching featured projects:', error)
        return
      }
      
      setFeaturedProjects(projects)
    }
    
    fetchFeaturedProjects()
  }, [])

  return (
    <section className="bg-gray-50 py-16 px-8">
      <div className="container-wrapper">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Mine Prosjekter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description ?? ''}
              technologies={project.technologies ?? []}
              imageUrl={project.image_url ?? '/placeholder-project.jpg'}
              githubUrl={project.github_url ?? undefined}
              liveUrl={project.live_url ?? undefined}
            />
          ))}
        </div>

        {featuredProjects.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="/prosjekter"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Se alle prosjekter →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectsSection 