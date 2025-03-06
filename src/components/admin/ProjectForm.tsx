'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import { Project, ProjectFormData } from '@/types/project'
import { X } from 'lucide-react'
import ImageUploader from './ImageUploader'
import { toast } from 'react-hot-toast'

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
}

export default function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    image_url: '',
    technologies: [],
    category: '',
    github_url: '',
    live_url: '',
    project_type: '',
    featured: false,
    status: 'draft',
    sort_order: 0
  })
  
  const [newTechnology, setNewTechnology] = useState('')

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        description: project.description || '',
        short_description: project.short_description || '',
        image_url: project.image_url || '',
        technologies: project.technologies || [],
        category: project.category || '',
        github_url: project.github_url || '',
        live_url: project.live_url || '',
        project_type: project.project_type || '',
        featured: project.featured || false,
        status: project.status || 'draft',
        sort_order: project.sort_order || 0
      })
    }
  }, [project])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Valider at tittel og slug er fylt ut
      if (!formData.title.trim()) {
        throw new Error('Tittel er påkrevd')
      }
      
      if (!formData.slug.trim()) {
        throw new Error('Slug er påkrevd')
      }
      
      // Sjekk om slug allerede eksisterer (unntatt ved redigering av samme prosjekt)
      const { data: existingProject, error: slugCheckError } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', formData.slug)
        .single()
      
      if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 = Ingen resultater
        throw slugCheckError
      }
      
      if (existingProject && (!isEdit || existingProject.id !== project?.id)) {
        throw new Error('Et prosjekt med denne slug-en eksisterer allerede')
      }
      
      // Lagre prosjekt
      if (isEdit && project?.id) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', project.id)
        
        if (updateError) throw updateError
        toast.success('Prosjektet ble oppdatert!')
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert([formData])
        
        if (insertError) throw insertError
        toast.success('Prosjektet ble opprettet!')
      }
      
      router.push('/admin/projects')
      router.refresh()
    } catch (error: any) {
      console.error('Feil ved lagring av prosjekt:', error)
      setError(error.message || 'Det oppstod en feil ved lagring av prosjektet')
      toast.error(error.message || 'Det oppstod en feil ved lagring av prosjektet')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Fjern spesialtegn
        .replace(/\s+/g, '-') // Erstatt mellomrom med bindestrek
        .replace(/-+/g, '-') // Unngå flere bindestreker etter hverandre
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Tittel */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Tittel *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Bilde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prosjektbilde
            </label>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              bucketName="project-images"
              folderPath="projects"
            />
          </div>
          
          {/* Kort beskrivelse */}
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
              Kort beskrivelse
            </label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              En kort oppsummering som vises i prosjektoversikten
            </p>
          </div>
          
          {/* Full beskrivelse */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Full beskrivelse
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Teknologier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teknologier
            </label>
            <div className="flex">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                className="mt-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="Legg til teknologi"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="mt-1 inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Legg til
              </button>
            </div>
            
            {formData.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.technologies.map(tech => (
                  <div key={tech} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm text-gray-800">{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Kategori */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Prosjekttype */}
          <div>
            <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-1">
              Prosjekttype
            </label>
            <select
              id="project_type"
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Velg type</option>
              <option value="personlig">Personlig prosjekt</option>
              <option value="kunde">Kundeprosjekt</option>
              <option value="open-source">Open Source</option>
              <option value="studie">Studieprosjekt</option>
            </select>
          </div>
          
          {/* GitHub URL */}
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Live URL */}
          <div>
            <label htmlFor="live_url" className="block text-sm font-medium text-gray-700 mb-1">
              Live URL
            </label>
            <input
              type="url"
              id="live_url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <div className="flex">
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="mt-1 inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Generer
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Dette blir URL-en til prosjektet: /prosjekter/<span className="font-mono">{formData.slug || 'prosjekt-navn'}</span>
            </p>
          </div>
          
          {/* Sorteringsrekkefølge */}
          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
              Sorteringsrekkefølge
            </label>
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              value={formData.sort_order}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  sort_order: parseInt(e.target.value) || 0
                }))
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Fremhevet */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Fremhevet prosjekt
            </label>
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="draft">Utkast</option>
              <option value="published">Publisert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Lagrer...' : isEdit ? 'Oppdater prosjekt' : 'Opprett prosjekt'}
        </button>
      </div>
    </form>
  )
} 