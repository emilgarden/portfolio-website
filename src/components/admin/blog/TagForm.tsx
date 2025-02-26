'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import { BlogTag } from '@/types/blog'

interface TagFormProps {
  tag?: BlogTag;
  isEdit?: boolean;
}

export default function TagForm({ tag, isEdit = false }: TagFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    slug: tag?.slug || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Automatisk generere slug fra navn hvis slug-feltet er tomt
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Fjern spesialtegn
          .replace(/\s+/g, '-') // Erstatt mellomrom med bindestrek
          .replace(/--+/g, '-') // Erstatt flere bindestreker med én
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Valider at navn og slug er fylt ut
      if (!formData.name.trim()) {
        throw new Error('Taggnavn er påkrevd')
      }
      
      if (!formData.slug.trim()) {
        throw new Error('Tagg-slug er påkrevd')
      }
      
      // Sjekk om slug allerede eksisterer (unntatt ved redigering av samme tagg)
      const { data: existingTag, error: slugCheckError } = await supabase
        .from('blog_tags')
        .select('id')
        .eq('slug', formData.slug)
        .single()
      
      if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 = Ingen resultater
        throw slugCheckError
      }
      
      if (existingTag && (!isEdit || existingTag.id !== tag?.id)) {
        throw new Error('En tagg med denne slug-en eksisterer allerede')
      }
      
      // Lagre tagg
      const { error: saveError } = isEdit 
        ? await supabase
            .from('blog_tags')
            .update(formData)
            .eq('id', tag?.id)
        : await supabase
            .from('blog_tags')
            .insert([formData])
      
      if (saveError) {
        throw saveError
      }
      
      router.push('/admin/blog/tags')
      router.refresh()
    } catch (error: any) {
      console.error('Feil ved lagring av tagg:', error)
      setError(error.message || 'Det oppstod en feil ved lagring av taggen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Navn */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Taggnavn *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL-vennlig identifikator for taggen. Bruk kun små bokstaver, tall og bindestreker.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/admin/blog/tags')}
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
          {loading ? 'Lagrer...' : isEdit ? 'Oppdater tagg' : 'Opprett tagg'}
        </button>
      </div>
    </form>
  )
} 