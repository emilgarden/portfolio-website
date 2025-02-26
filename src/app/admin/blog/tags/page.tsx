'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/supabaseClient'
import { BlogTag } from '@/types/blog'
import { Trash2, Edit, Plus } from 'lucide-react'

export default function TagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setTags(data || [])
    } catch (error: any) {
      console.error('Feil ved henting av tagger:', error)
      setError('Kunne ikke hente tagger: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne taggen? Dette vil fjerne taggen fra alle blogginnlegg.')) {
      return
    }
    
    try {
      setLoading(true)
      
      // Først fjern alle koblinger til blogginnlegg
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('tag_id', id)
      
      // Deretter slett selve taggen
      const { error } = await supabase
        .from('blog_tags')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Oppdater listen etter sletting
      setTags(tags.filter(tag => tag.id !== id))
    } catch (error: any) {
      console.error('Feil ved sletting av tagg:', error)
      alert('Kunne ikke slette tagg: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bloggtagger</h1>
        <Link 
          href="/admin/blog/tags/new"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ny tagg
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {tags.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Ingen tagger funnet. Opprett din første tagg.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Navn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opprettet
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Handlinger</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tag.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{tag.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(tag.created_at).toLocaleDateString('no-NO')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/blog/tags/${tag.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Rediger tagg"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Slett tagg"
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