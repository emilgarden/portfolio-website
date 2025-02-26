'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import CategoryForm from '@/components/admin/blog/CategoryForm'
import { BlogCategory } from '@/types/blog'
import Link from 'next/link'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<BlogCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true)
        setError(null)
        
        if (!params.id) {
          throw new Error('Kategori-ID mangler')
        }
        
        const { data, error } = await supabase
          .from('blog_categories')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) {
          throw error
        }
        
        setCategory(data)
      } catch (error: any) {
        console.error('Feil ved henting av kategori:', error)
        setError('Kunne ikke hente kategori: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategory()
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
          onClick={() => router.push('/admin/blog/categories')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tilbake til kategorier
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rediger kategori</h1>
        <Link 
          href="/admin/blog/categories"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til kategorier
        </Link>
      </div>
      
      {category && <CategoryForm category={category} isEdit={true} />}
    </div>
  )
} 