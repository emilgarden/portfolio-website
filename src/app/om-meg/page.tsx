import { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'

export const metadata: Metadata = {
  title: 'Om Meg',
  description: 'Lær mer om min bakgrunn, erfaring og tilnærming til webutvikling.',
  openGraph: {
    title: 'Om Meg | Ole Emil Øygarden',
    description: 'Lær mer om min bakgrunn, erfaring og tilnærming til webutvikling.',
  }
}

export default function Page() {
  return <AboutPage />
} 