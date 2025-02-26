'use client'

import { useAppSelector } from '@/hooks/redux'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import OptimizedImage from '@/components/common/OptimizedImage'
import VirtualList from '@/components/common/VirtualList'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import BlogPostCard from '@/components/common/BlogPostCard'

const PostMetadata = ({ date, readingTime }: { date?: string, readingTime?: string | number }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600">
    <div className="flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {date ? new Date(date).toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Ingen dato'}
    </div>
    <div className="flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {readingTime || 5} min
    </div>
  </div>
)

const PostTags = ({ tags }: { tags?: Array<{ tag: { name: string } }> | string[] }) => {
  // Hvis tags er undefined, returner en tom array
  if (!tags || tags.length === 0) return null;
  
  // Konverter tags til string[] hvis det er objekter
  const tagNames = Array.isArray(tags) && typeof tags[0] === 'string' 
    ? tags as string[]
    : (tags as Array<{ tag: { name: string } }>).map(t => t.tag.name);
  
  return (
    <div className="flex flex-wrap gap-2">
      {tagNames.map(tag => (
        <span
          key={tag}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const FeaturedPost = ({ post }: { post: BlogPost }) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  })

  return (
    <article 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-64 w-full">
        <OptimizedImage
          src={post.image || '/images/blog/placeholder.jpg'}
          alt={post.title || 'Blogginnlegg'}
          fill
          priority={entry?.isIntersecting}
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <PostMetadata date={post.date} readingTime={post.reading_time} />
        <h2 className="text-2xl font-bold mt-3 mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-red-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <PostTags tags={post.tags} />
      </div>
    </article>
  )
}

const BlogCard = ({ post }: { post: BlogPost }) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  })

  return (
    <article 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 w-full">
        <OptimizedImage
          src={post.image || '/images/blog/placeholder.jpg'}
          alt={post.title || 'Blogginnlegg'}
          fill
          priority={entry?.isIntersecting}
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <PostMetadata date={post.date} readingTime={post.readingTime} />
        <h3 className="text-xl font-bold mt-3 mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-red-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <PostTags tags={post.tags} />
      </div>
    </article>
  )
}

interface BlogGridProps {
  posts: any[]
  emptyMessage?: string
}

export default function BlogGrid({ posts, emptyMessage = "Ingen innlegg funnet." }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          title={post.title}
          excerpt={post.excerpt}
          date={post.date}
          readTime={post.readingTime}
          imageUrl={post.image}
          slug={post.slug}
        />
      ))}
    </div>
  )
} 