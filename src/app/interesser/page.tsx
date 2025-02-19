import { Metadata } from 'next'
import InterestsPage from '@/components/pages/InterestsPage'

export const metadata: Metadata = {
  title: 'Interesser',
  description: 'Utforsk mine interesser innen teknologi, fotografi, musikk og mer.',
  openGraph: {
    title: 'Interesser | Ole Emil Øygarden',
    description: 'Utforsk mine interesser innen teknologi, fotografi, musikk og mer.',
  }
}

export default function Page() {
  return <InterestsPage />
} 