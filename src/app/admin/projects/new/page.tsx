'use client'

import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

export default function NewProjectPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nytt prosjekt</h1>
        <Link 
          href="/admin/projects"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Tilbake til oversikten
        </Link>
      </div>
      
      <ProjectForm />
    </div>
  )
} 