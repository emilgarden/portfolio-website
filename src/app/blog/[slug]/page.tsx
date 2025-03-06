import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import supabase from '@/supabaseClient'
import { formatDate } from '@/utils/date'


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Innlegg ikke funnet',
    }
  }
  
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || `Les mer om ${post.title}`,
    openGraph: post.featured_image ? {
      images: [{ url: post.featured_image }],
    } : undefined,
  }
}

async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name),
      tags:blog_post_tags(
        tag:blog_tags(id, name)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single()
  
  if (error || !data) {
    console.error('Feil ved henting av blogginnlegg:', error)
    return null
  }
  
  return data
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center text-red-600 hover:text-red-800 mb-6">
        ← Tilbake til alle innlegg
      </Link>
      
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <time dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
            
            {post.reading_time && (
              <span>{post.reading_time} min lesing</span>
            )}
            
            {post.category && (
              <Link 
                href={`/blog/category/${post.category.id}`}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
          </div>
          
          {post.featured_image && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Tagger:</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tagItem: any) => (
                <Link
                  key={tagItem.tag.id}
                  href={`/blog/tag/${tagItem.tag.id}`}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tagItem.tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
} 