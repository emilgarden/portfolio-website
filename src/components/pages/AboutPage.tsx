'use client'

import { useState } from 'react'
import AboutHero from '@/components/sections/AboutHero'
import TabNavigation from '@/components/sections/TabNavigation'
import AboutContent from '@/components/sections/AboutContent'
import ExperienceContent from '@/components/sections/ExperienceContent'
import SkillsContent from '@/components/sections/SkillsContent'
import PhilosophyContent from '@/components/sections/PhilosophyContent'
import InterestGrid from '@/components/sections/InterestGrid'
import { TabSections } from '@/types/about'
import { interests } from '@/data/interests'

const sections: TabSections = {
  about: {
    title: "Om Meg",
    content: <AboutContent />
  },
  experience: {
    title: "Erfaring",
    content: <ExperienceContent />
  },
  skills: {
    title: "Teknisk Erfaring",
    content: <SkillsContent />
  },
  interests: {
    title: "Interesser",
    content: <InterestGrid interests={interests} />
  },
  philosophy: {
    title: "Filosofi",
    content: <PhilosophyContent />
  }
}

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<keyof TabSections>('about')

  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      
      {/* Tab Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-8">
          <TabNavigation 
            sections={sections}
            activeSection={activeSection}
            onTabChange={setActiveSection}
          />
        </div>
      </nav>
      
      {/* Tab Content */}
      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {sections[activeSection].content}
        </div>
      </div>
    </main>
  )
} 