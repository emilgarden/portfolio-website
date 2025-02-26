import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import supabase from '@/supabaseClient'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/utils/date'

export const metadata: Metadata = {
  title: 'Blog | Min Nettside',
  description: 'Les våre siste blogginnlegg om design, utvikling og teknologi',
}

async function getBlogPosts() {
  const { data, error } = await supabase
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
  
  if (error) {
    console.error('Feil ved henting av blogginnlegg:', error)
    return []
  }
  
  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Ingen blogginnlegg er publisert ennå.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {post.featured_image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                {post.category && (
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">
                    {post.category.name}
                  </span>
                )}
                
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-red-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                  <span>{post.reading_time || 1} min lesing</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 