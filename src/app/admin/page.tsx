'use client'

import { useEffect, useState } from 'react'
import supabase from '@/supabaseClient'
import Link from 'next/link'
import { BarChart3, FileText, Folder, Users } from 'lucide-react'

interface DashboardStats {
  projectCount: number;
  draftProjectCount: number;
  publishedProjectCount: number;
  blogCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projectCount: 0,
    draftProjectCount: 0,
    publishedProjectCount: 0,
    blogCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Henter prosjektstatistikk...')
        
        // Hent alle prosjekter for å telle dem
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
        
        if (projectsError) {
          console.error('Feil ved henting av prosjekter:', projectsError)
          throw projectsError
        }
        
        console.log('Hentet prosjekter:', projectsData)
        
        // Beregn statistikk for prosjekter
        const projectCount = projectsData?.length || 0
        const draftProjectCount = projectsData?.filter(p => p.status === 'draft').length || 0
        const publishedProjectCount = projectsData?.filter(p => p.status === 'published').length || 0
        
        console.log('Prosjektstatistikk:', { projectCount, draftProjectCount, publishedProjectCount })
        
        // Sjekk om blog_posts-tabellen eksisterer før vi prøver å hente data
        let blogCount = 0
        try {
          const { count, error: blogError } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true })
          
          if (!blogError) {
            blogCount = count || 0
          }
        } catch (error) {
          console.warn('Kunne ikke hente bloggstatistikk, tabellen eksisterer kanskje ikke ennå')
        }
        
        setStats({
          projectCount,
          draftProjectCount,
          publishedProjectCount,
          blogCount
        })
      } catch (error: any) {
        console.error('Feil ved henting av statistikk:', error)
        setError('Kunne ikke hente statistikk: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Prosjekter</h2>
                <Folder className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">{stats.projectCount}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{stats.publishedProjectCount} publisert</span>
                <span>{stats.draftProjectCount} utkast</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Blogginnlegg</h2>
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-4">{stats.blogCount}</p>
              <Link 
                href="/admin/blog"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Administrer blogg →
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Nylige prosjekter</h2>
              <RecentProjects />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Hurtiglenker</h2>
              <div className="space-y-2">
                <Link 
                  href="/admin/projects/new"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Opprett nytt prosjekt
                </Link>
                <Link 
                  href="/admin/blog/new"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Skriv nytt blogginnlegg
                </Link>
                <Link 
                  href="/admin/settings"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Administrer innstillinger
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Komponent for å vise nylige prosjekter
function RecentProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, status, created_at, slug')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (error) throw error
        
        setProjects(data || [])
      } catch (error) {
        console.error('Feil ved henting av nylige prosjekter:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecentProjects()
  }, [])

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-md"></div>
  }

  if (projects.length === 0) {
    return <p className="text-gray-500">Ingen prosjekter funnet.</p>
  }

  return (
    <div className="space-y-2">
      {projects.map(project => (
        <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <p className="font-medium">{project.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(project.created_at).toLocaleDateString('no-NO')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span 
              className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {project.status === 'published' ? 'Publisert' : 'Utkast'}
            </span>
            <Link 
              href={`/admin/projects/${project.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Rediger
            </Link>
          </div>
        </div>
      ))}
      
      <div className="pt-2">
        <Link 
          href="/admin/projects"
          className="text-red-600 hover:text-red-800"
        >
          Se alle prosjekter →
        </Link>
      </div>
    </div>
  )
} 