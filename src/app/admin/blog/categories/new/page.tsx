'use client'

import CategoryForm from '@/components/admin/blog/CategoryForm'
import Link from 'next/link'

export default function NewCategoryPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ny kategori</h1>
        <Link 
          href="/admin/blog/categories"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til kategorier
        </Link>
      </div>
      
      <CategoryForm />
    </div>
  )
} 