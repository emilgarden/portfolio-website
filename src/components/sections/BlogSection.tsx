'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BlogPost {
  id: number
  title: string
  description: string
  date: string
  readTime: string
  tags: string[]
  imageUrl: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Hvordan jeg bygget min portfolio med Next.js",
    description: "En dypdykk i prosessen med å lage en moderne og rask portfolio-nettside med Next.js og Tailwind CSS.",
    date: "2024-01-15",
    readTime: "5 min",
    tags: ["Web Utvikling", "Next.js", "React"],
    imageUrl: "/images/blog/nextjs-portfolio.jpg",
    slug: "building-portfolio-with-nextjs"
  },
  // Legg til flere blogginnlegg her
]

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
          href={`/blogg/${post.slug}`}
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

const BlogSection = () => {
  return (
    <section className="bg-white py-16 px-8">
      <div className="container-wrapper">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Siste Blogginnlegg
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection 