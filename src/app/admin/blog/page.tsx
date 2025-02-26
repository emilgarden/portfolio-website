'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import supabase from '@/supabaseClient'
import { FileText, Tag, FolderOpen, Plus } from 'lucide-react'

export default function BlogAdminPage() {
  const [stats, setStats] = useState({
    postCount: 0,
    categoryCount: 0,
    tagCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        // Hent antall innlegg
        const { count: postCount, error: postError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
        
        // Hent antall kategorier
        const { count: categoryCount, error: categoryError } = await supabase
          .from('blog_categories')
          .select('*', { count: 'exact', head: true })
        
        // Hent antall tagger
        const { count: tagCount, error: tagError } = await supabase
          .from('blog_tags')
          .select('*', { count: 'exact', head: true })
        
        setStats({
          postCount: postCount || 0,
          categoryCount: categoryCount || 0,
          tagCount: tagCount || 0
        })
      } catch (error) {
        console.error('Feil ved henting av bloggstatistikk:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Bloggadministrasjon</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Statistikk-kort */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Innlegg</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.postCount}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/admin/blog/posts"
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Se alle innlegg →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Kategorier</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.categoryCount}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/admin/blog/categories"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Administrer kategorier →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Tag className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tagger</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.tagCount}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/admin/blog/tags"
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Administrer tagger →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Hurtighandlinger</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/admin/blog/posts/new"
                className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-red-600 mr-2" />
                <span>Nytt blogginnlegg</span>
              </Link>
              
              <Link 
                href="/admin/blog/categories/new"
                className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-blue-600 mr-2" />
                <span>Ny kategori</span>
              </Link>
              
              <Link 
                href="/admin/blog/tags/new"
                className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-green-600 mr-2" />
                <span>Ny tagg</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 