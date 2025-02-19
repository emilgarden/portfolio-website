'use client'

import { useAppSelector } from '@/hooks/redux'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import OptimizedImage from '@/components/common/OptimizedImage'
import VirtualList from '@/components/common/VirtualList'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'

const PostMetadata = ({ date, readingTime }: { date: string, readingTime: string }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600">
    <div className="flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {new Date(date).toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
    <div className="flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {readingTime} min
    </div>
  </div>
)

const PostTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map(tag => (
      <span
        key={tag}
        className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full"
      >
        {tag}
      </span>
    ))}
  </div>
)

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
          src={post.image}
          alt={post.title}
          fill
          priority={entry?.isIntersecting}
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <PostMetadata date={post.date} readingTime={post.readingTime} />
        <h2 className="text-2xl font-bold mt-3 mb-2">
          <Link href={`/blogg/${post.slug}`} className="hover:text-red-600 transition-colors">
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
          src={post.image}
          alt={post.title}
          fill
          priority={entry?.isIntersecting}
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <PostMetadata date={post.date} readingTime={post.readingTime} />
        <h3 className="text-xl font-bold mt-3 mb-2">
          <Link href={`/blogg/${post.slug}`} className="hover:text-red-600 transition-colors">
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

const BlogGrid = ({ posts }: { posts: BlogPost[] }) => {
  const { 
    searchQuery, 
    selectedTags, 
    selectedCategory,
    isLoading,
    error 
  } = useAppSelector(state => state.blog)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => post.tags.includes(tag))
    
    const matchesCategory = !selectedCategory || 
                           post.categories.includes(selectedCategory)

    return matchesSearch && matchesTags && matchesCategory
  })

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Ingen innlegg funnet
        </h2>
        <p className="mt-2 text-gray-600">
          Prøv å justere søkekriteriene dine
        </p>
      </div>
    )
  }

  const featuredPost = filteredPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div>
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <VirtualList
        items={regularPosts}
        itemHeight={450} // Juster denne verdien basert på faktisk korthøyde
        containerHeight={900} // Juster denne verdien basert på ønsket containerhøyde
        renderItem={(post) => (
          <BlogCard key={post.id} post={post} />
        )}
      />
    </div>
  )
}

export default BlogGrid 