'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/supabaseClient'
import { BlogPost } from '@/types/blog'
import { Trash2, Edit, Plus, Eye } from 'lucide-react'
import Image from 'next/image'

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(id, name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      setPosts(data || [])
    } catch (error: any) {
      console.error('Feil ved henting av innlegg:', error)
      setError('Kunne ikke hente innlegg: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm('Er du sikker på at du vil slette dette innlegget? Denne handlingen kan ikke angres.')) {
      return
    }
    
    try {
      setLoading(true)
      
      // Først fjern alle tag-koblinger
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id.toString())
      
      // Deretter slett selve innlegget
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id.toString())
      
      if (error) {
        throw error
      }
      
      // Oppdater listen etter sletting
      setPosts(posts.filter(post => post.id !== id))
    } catch (error: any) {
      console.error('Feil ved sletting av innlegg:', error)
      alert('Kunne ikke slette innlegg: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, publishedAt: string | null | undefined) => {
    if (status === 'published') {
      if (publishedAt && new Date(publishedAt) > new Date()) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Planlagt
          </span>
        )
      }
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Publisert
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
        Utkast
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blogginnlegg</h1>
        <Link 
          href="/admin/blog/posts/new"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nytt innlegg
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
          {posts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Ingen innlegg funnet. Opprett ditt første blogginnlegg.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Innlegg
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dato
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Handlinger</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {post.featured_image && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <Image 
                                src={post.featured_image} 
                                alt={post.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            <div className="text-sm text-gray-500">/{post.slug}</div>
                            {post.is_featured && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 mt-1 inline-block">
                                Fremhevet
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(post.status, post.published_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {post.category ? post.category.name : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {post.published_at 
                            ? new Date(post.published_at).toLocaleDateString('no-NO')
                            : new Date(post.created_at).toLocaleDateString('no-NO') + ' (utkast)'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {post.status === 'published' && (
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="text-gray-600 hover:text-gray-900"
                              title="Vis innlegg"
                              target="_blank"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                          )}
                          <Link 
                            href={`/admin/blog/posts/${post.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Rediger innlegg"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Slett innlegg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 