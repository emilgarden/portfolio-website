'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import TagForm from '@/components/admin/blog/TagForm'
import { BlogTag } from '@/types/blog'
import Link from 'next/link'

export default function EditTagPage() {
  const params = useParams()
  const router = useRouter()
  const [tag, setTag] = useState<BlogTag | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTag() {
      try {
        setLoading(true)
        setError(null)
        
        if (!params.id) {
          throw new Error('Tagg-ID mangler')
        }
        
        const { data, error } = await supabase
          .from('blog_tags')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) {
          throw error
        }
        
        setTag(data)
      } catch (error: any) {
        console.error('Feil ved henting av tagg:', error)
        setError('Kunne ikke hente tagg: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTag()
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
          onClick={() => router.push('/admin/blog/tags')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tilbake til tagger
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rediger tagg</h1>
        <Link 
          href="/admin/blog/tags"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til tagger
        </Link>
      </div>
      
      {tag && <TagForm tag={tag} isEdit={true} />}
    </div>
  )
} 