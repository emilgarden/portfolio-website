import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const ProjectsPage = dynamic(
  () => import('@/components/pages/ProjectsPage'),
  {
    loading: () => <LoadingSpinner />
  }
)

export const metadata: Metadata = {
  title: 'Prosjekter',
  description: 'Utforsk mine siste prosjekter innen webutvikling, design og teknologi.',
  openGraph: {
    title: 'Prosjekter | Ole Emil Øygarden',
    description: 'Utforsk mine siste prosjekter innen webutvikling, design og teknologi.',
  }
}

export default function Page() {
  return <ProjectsPage />
} 