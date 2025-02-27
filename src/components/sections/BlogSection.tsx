'use client'

import Link from 'next/link'
import Image from 'next/image'
import SectionHeading from '../common/SectionHeading'

interface BlogPost {
  id: string | number
  title: string
  description: string
  date: string
  readTime: string
  tags: string[]
  imageUrl: string
  slug: string
}

interface BlogSectionProps {
  posts: BlogPost[]
}

const BlogCard = ({ post }: { post: BlogPost }) => {
  // Helper funksjon for å formatere dato
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
      {/* Featurbilde */}
      <div className="relative h-48 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.date)}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readTime}
          </div>
        </div>

        {/* Tittel og beskrivelse */}
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {post.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Les mer lenke */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
        >
          Les mer
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Siste fra bloggen"
          alignment="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/blog" 
            className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Se alle innlegg
          </Link>
        </div>
      </div>
    </section>
  )
} 