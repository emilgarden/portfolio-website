'use client'

import { Code, Book, Music, Camera, Bike, Coffee } from 'lucide-react'
import InterestHero from '@/components/sections/InterestHero'
import InterestGrid from '@/components/sections/InterestGrid'
import { Interest } from '@/types/interest'
import { interests } from '@/data/interests'

const interests: Interest[] = [
  {
    id: 1,
    title: "Programmering",
    description: "Utforsker nye teknologier og bygger kreative løsninger. Spesielt interessert i webutvikling og AI.",
    icon: Code,
    color: "bg-blue-100",
    textColor: "text-blue-700",
    categories: ["Teknologi", "Utvikling"],
    related: ["Web", "AI", "Open Source"]
  },
  {
    id: 2,
    title: "Lesing",
    description: "Fordyper meg i fagbøker om teknologi og personlig utvikling, samt skjønnlitteratur.",
    icon: Book,
    color: "bg-green-100",
    textColor: "text-green-700",
    categories: ["Læring", "Hobby"],
    related: ["Bøker", "Personlig utvikling", "Teknologi"]
  },
  // ... resten av interessene
]

export default function InterestsPage() {
  return (
    <main className="min-h-screen bg-white">
      <InterestHero />
      
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <InterestGrid interests={interests} />
          
          {/* Sitatblokk */}
          <div className="mt-16 text-center">
            <blockquote className="text-2xl font-light italic text-gray-600 max-w-3xl mx-auto">
              "Livet handler om å utforske, lære og vokse. Gjennom mine interesser 
              finner jeg inspirasjon og muligheter for kontinuerlig utvikling."
            </blockquote>
          </div>
        </div>
      </div>
    </main>
  )
} 