'use client'

import OptimizedImage from '@/components/common/OptimizedImage'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ProfileData } from '@/lib/profile'
import Image from 'next/image'

interface HomeHeroProps {
  profileData: ProfileData | null
}

const HomeHero = ({ profileData }: HomeHeroProps) => {
  // Fallback-verdier hvis profildata ikke finnes
  const name = profileData?.name || 'Ole Emil'
  const profileImage = profileData?.profile_image || '/images/profile.jpg'
  
  return (
    <section className="bg-rose-50/40 pt-20 md:pt-24 pb-16">
      <div className="container-wrapper">
        {/* Profilbilde og navn */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            {name}
          </h1>
          
          {/* CTA-knapper */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link
              href="/prosjekter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg
                       hover:bg-red-700 transition-colors"
            >
              Se mine prosjekter
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blogg"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg
                       hover:bg-gray-100 transition-colors shadow-sm"
            >
              Les bloggen min
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero 