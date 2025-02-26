'use client'

import PostForm from '@/components/admin/blog/PostForm'
import Link from 'next/link'

export default function NewPostPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nytt blogginnlegg</h1>
        <Link 
          href="/admin/blog/posts"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til innlegg
        </Link>
      </div>
      
      <PostForm />
    </div>
  )
} 