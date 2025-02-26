'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/supabaseClient'
import { BlogCategory } from '@/types/blog'
import { Trash2, Edit, Plus } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setCategories(data || [])
    } catch (error: any) {
      console.error('Feil ved henting av kategorier:', error)
      setError('Kunne ikke hente kategorier: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne kategorien? Dette vil påvirke alle blogginnlegg i denne kategorien.')) {
      return
    }
    
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Oppdater listen etter sletting
      setCategories(categories.filter(category => category.id !== id))
    } catch (error: any) {
      console.error('Feil ved sletting av kategori:', error)
      alert('Kunne ikke slette kategori: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bloggkategorier</h1>
        <Link 
          href="/admin/blog/categories/new"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ny kategori
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
          {categories.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Ingen kategorier funnet. Opprett din første kategori.
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
                    Beskrivelse
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
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(category.created_at).toLocaleDateString('no-NO')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/blog/categories/${category.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Rediger kategori"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Slett kategori"
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