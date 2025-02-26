'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import PostForm from '@/components/admin/blog/PostForm'
import { BlogPost } from '@/types/blog'
import Link from 'next/link'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        setError(null)
        
        if (!params.id) {
          throw new Error('Innlegg-ID mangler')
        }
        
        // Hent innlegget med kategori og tagger
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            category:blog_categories(id, name),
            tags:blog_post_tags(tag_id)
          `)
          .eq('id', params.id)
          .single()
        
        if (error) {
          throw error
        }
        
        // Hent alle tagger for innlegget
        if (data.tags && data.tags.length > 0) {
          const tagIds = data.tags.map((t: any) => t.tag_id)
          
          const { data: tagData, error: tagError } = await supabase
            .from('blog_tags')
            .select('*')
            .in('id', tagIds)
          
          if (tagError) {
            throw tagError
          }
          
          data.tags = tagData
        }
        
        setPost(data)
      } catch (error: any) {
        console.error('Feil ved henting av innlegg:', error)
        setError('Kunne ikke hente innlegg: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
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
          onClick={() => router.push('/admin/blog/posts')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tilbake til innlegg
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rediger blogginnlegg</h1>
        <Link 
          href="/admin/blog/posts"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til innlegg
        </Link>
      </div>
      
      {post && <PostForm post={post} isEdit={true} />}
    </div>
  )
} 