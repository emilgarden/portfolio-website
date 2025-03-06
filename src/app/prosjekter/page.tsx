import { Metadata } from 'next'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ProjectHero from '@/components/sections/ProjectHero'
import ProjectGrid from '@/components/sections/ProjectGrid'
import FilteredProjects from '@/components/sections/FilteredProjects'

export const metadata: Metadata = {
  title: 'Prosjekter',
  description: 'Utforsk mine siste prosjekter innen webutvikling, design og teknologi.',
  openGraph: {
    title: 'Prosjekter | Ole Emil Øygarden',
    description: 'Utforsk mine siste prosjekter innen webutvikling, design og teknologi.',
  }
}

export const revalidate = 3600 // Revaliderer hver time

async function getProjects() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  
  return projects
}

export default async function Page() {
  const projects = await getProjects()
  
  const categories = [...new Set(projects.map(p => p.category))].filter(Boolean)
  const technologies = [...new Set(projects.flatMap(p => p.technologies))].filter(Boolean)
  
  return (
    <main>
      <ProjectHero />
      <div className="container-wrapper py-16">
        <FilteredProjects 
          projects={projects}
          categories={categories}
          technologies={technologies}
        />
      </div>
    </main>
  )
} 