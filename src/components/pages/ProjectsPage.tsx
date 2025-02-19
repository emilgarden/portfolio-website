'use client'

import ProjectGrid from '@/components/sections/ProjectGrid'
import ProjectHero from '@/components/sections/ProjectHero'
import { projects } from '@/data/projects'

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProjectHero />
      <div className="container-wrapper py-16">
        <ProjectGrid projects={projects} />
      </div>
    </main>
  )
} 