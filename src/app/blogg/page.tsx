import { Metadata } from 'next'
import BlogPage from '@/components/pages/BlogPage'

export const metadata: Metadata = {
  title: 'Blogg',
  description: 'Tanker og erfaringer om webutvikling, programmering og teknologi.',
  openGraph: {
    title: 'Blogg | Ole Emil Øygarden',
    description: 'Tanker og erfaringer om webutvikling, programmering og teknologi.',
  }
}

export default function Page() {
  return <BlogPage />
} 