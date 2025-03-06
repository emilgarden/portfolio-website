import Image from 'next/image'
import Link from 'next/link'
import { getProfileData } from '@/lib/profile'

export default async function HeroSection() {
  const profileData = await getProfileData()
  
  // Fallback-verdier hvis profildata ikke finnes
  const name = profileData?.name || 'Ole Emil Øygarden'
  const bio = profileData?.bio || 'Jeg skaper responsive og brukervennlige nettsider med React og Next.js.'
  const profileImage = profileData?.profile_image || '/images/profile.jpg'
  
  return (
    <section className="min-h-[70vh] bg-rose-50/40 pt-20 md:pt-24 pb-16">
      <div className="container-wrapper flex flex-col items-center justify-center text-center h-full">
        {/* Profilbilde */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={profileImage}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navn */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
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
          </Link>
          <Link
            href="/blogg"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg
                     hover:bg-gray-100 transition-colors shadow-sm"
          >
            Les bloggen min
          </Link>
        </div>
        
        {/* Bio */}
        {bio && (
          <p className="text-base md:text-lg text-gray-700 max-w-3xl">
            {bio}
          </p>
        )}
      </div>
    </section>
  )
} 