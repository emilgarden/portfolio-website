'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { setPosts, setLoading, setError } from '@/store/blogSlice'
import BlogHero from '@/components/sections/BlogHero'
import BlogGrid from '@/components/sections/BlogGrid'
import BlogSidebar from '@/components/sections/BlogSidebar'
import { BlogPost } from '@/types/blog'

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Hvordan jeg bygget min portfolio med Next.js",
    excerpt: "En detaljert gjennomgang av prosessen med å bygge en moderne portfolio-nettside med Next.js og Tailwind CSS.",
    image: "/images/blog/nextjs-portfolio.jpg",
    date: "2024-03-15",
    readingTime: "5",
    categories: ["Web Utvikling"],
    tags: ["Next.js", "React", "Tailwind CSS"],
    featured: true,
    slug: "building-portfolio-nextjs"
  },
  // ... resten av blogginnleggene
]

const categories = ['Teknologi', 'Utvikling', 'Design', 'Karriere']
const tags = ['React', 'Next.js', 'TypeScript', 'UI/UX', 'Frontend', 'Backend']

export default function BlogPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    try {
      dispatch(setPosts(blogPosts))
    } catch (error) {
      dispatch(setError('Kunne ikke laste blogginnlegg'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  return (
    <main className="min-h-screen bg-white">
      <BlogHero />
      
      <div className="container-wrapper py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 order-last lg:order-first">
            <BlogGrid posts={blogPosts} />
          </div>
          <div className="order-first lg:order-last">
            <BlogSidebar 
              categories={categories}
              tags={tags}
            />
          </div>
        </div>
      </div>
    </main>
  )
} 