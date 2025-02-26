'use client'

import TagForm from '@/components/admin/blog/TagForm'
import Link from 'next/link'

export default function NewTagPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ny tagg</h1>
        <Link 
          href="/admin/blog/tags"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til tagger
        </Link>
      </div>
      
      <TagForm />
    </div>
  )
} 