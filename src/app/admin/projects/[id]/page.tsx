'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import ProjectForm from '@/components/admin/ProjectForm'
import { Project } from '@/types/project'
import Link from 'next/link'

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true)
        setError(null)
        
        if (!params.id) {
          throw new Error('Prosjekt-ID mangler')
        }
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) {
          throw error
        }
        
        setProject(data)
      } catch (error: any) {
        console.error('Feil ved henting av prosjekt:', error)
        setError('Kunne ikke hente prosjekt: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={() => router.push('/admin/projects')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tilbake til prosjekter
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rediger prosjekt</h1>
        <Link 
          href="/admin/projects"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til oversikten
        </Link>
      </div>
      
      {project && <ProjectForm project={project} isEdit={true} />}
    </div>
  )
} 