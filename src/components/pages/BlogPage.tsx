'use client'

import { useEffect, useState } from 'react'
import BlogHero from '@/components/sections/BlogHero'
import BlogGrid from '@/components/sections/BlogGrid'
import BlogSidebar from '@/components/sections/BlogSidebar'
import supabase from '@/supabaseClient'
import { BlogPost } from '@/types/blog'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Hent blogginnlegg
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            category:blog_categories(id, name),
            tags:blog_post_tags(
              tag:blog_tags(id, name)
            )
          `)
          .eq('status', 'published')
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })
        
        if (postsError) throw postsError
        
        // Hent kategorier
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('name')
          .order('name')
        
        if (categoriesError) throw categoriesError
        
        // Hent tagger
        const { data: tagsData, error: tagsError } = await supabase
          .from('blog_tags')
          .select('name')
          .order('name')
        
        if (tagsError) throw tagsError
        
        // Formater data
        const formattedPosts = postsData.map(post => ({
          ...post,
          categories: post.category ? [post.category.name] : [],
          tags: post.tags ? post.tags.map((t: any) => t.tag.name) : [],
          image: post.featured_image || '/images/blog/placeholder.jpg',
          date: post.published_at || post.created_at,
          readingTime: post.reading_time?.toString() || "5"
        }))
        
        setPosts(formattedPosts)
        setCategories(categoriesData.map(c => c.name))
        setTags(tagsData.map(t => t.name))
      } catch (error: any) {
        console.error('Feil ved henting av bloggdata:', error)
        setError('Kunne ikke laste blogginnlegg')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filtrer innlegg basert på aktiv kategori og tag
  const filteredPosts = posts.filter(post => {
    const matchesCategory = !activeCategory || post.category?.name === activeCategory
    const matchesTag = !activeTag || post.tags?.some(tagObj => tagObj.tag.name === activeTag)
    return matchesCategory && matchesTag
  })

  return (
    <main className="min-h-screen bg-white">
      <BlogHero />
      
      <div className="container-wrapper py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 order-last lg:order-first">
            {loading ? (
              <div className="text-center py-12">Laster innlegg...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">{error}</div>
            ) : (
              <BlogGrid 
                posts={filteredPosts} 
                emptyMessage="Ingen innlegg funnet med valgte filtre."
              />
            )}
          </div>
          <div className="order-first lg:order-last">
            <BlogSidebar 
              categories={categories}
              tags={tags}
              activeCategory={activeCategory}
              activeTag={activeTag}
              onCategoryClick={setActiveCategory}
              onTagClick={setActiveTag}
              onClearFilters={() => {
                setActiveCategory(null)
                setActiveTag(null)
              }}
            />
          </div>
        </div>
      </div>
    </main>
  )
} 