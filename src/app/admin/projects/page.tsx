'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/supabaseClient'
import { Project } from '@/types/project'
import { Trash2, Edit, Eye, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setProjects(data || [])
    } catch (error: any) {
      console.error('Feil ved henting av prosjekter:', error)
      setError('Kunne ikke hente prosjekter: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) {
      return
    }
    
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Oppdater listen etter sletting
      setProjects(projects.filter(project => project.id !== id))
      toast.success('Prosjektet ble slettet!')
    } catch (error: any) {
      console.error('Feil ved sletting av prosjekt:', error)
      alert('Kunne ikke slette prosjekt: ' + error.message)
      toast.error('Kunne ikke slette prosjekt: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePublishToggle(project: Project) {
    try {
      const newStatus = project.status === 'published' ? 'draft' : 'published'
      
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id)
      
      if (error) {
        throw error
      }
      
      // Oppdater prosjektet i listen
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, status: newStatus } : p
      ))
    } catch (error: any) {
      console.error('Feil ved endring av status:', error)
      alert('Kunne ikke endre status: ' + error.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prosjekter</h1>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nytt prosjekt
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading && projects.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Ingen prosjekter funnet</p>
              <Link 
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Opprett ditt første prosjekt
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prosjekt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opprettet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.short_description?.substring(0, 50)}
                        {project.short_description && project.short_description.length > 50 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePublishToggle(project)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${project.status === 'published' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                      >
                        {project.status === 'published' ? 'Publisert' : 'Utkast'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('no-NO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {project.slug && (
                          <a 
                            href={`/prosjekter/${project.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                            title="Vis prosjekt"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                        )}
                        <Link 
                          href={`/admin/projects/${project.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Rediger prosjekt"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Slett prosjekt"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
} 