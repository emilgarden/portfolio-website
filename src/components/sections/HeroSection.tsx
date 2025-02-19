'use client'

import Image from 'next/image'
import Button from '../common/Button'

const HeroSection = () => {
  return (
    <section className="min-h-[60vh] bg-rose-50/40 pt-12">
      <div className="container-wrapper h-[calc(60vh-3rem)] flex flex-col items-center justify-center text-center">
        {/* Profilbilde */}
        <div className="relative w-48 h-48 mb-6">
          <Image
            src="/images/profile.jpg"
            alt="Ole Emil Øygarden"
            width={192}
            height={192}
            className="rounded-full border-4 border-white shadow-lg object-cover"
            priority
          />
        </div>

        {/* Navn */}
        <h1 className="text-5xl font-bold mb-3 text-gray-900">
          Ole Emil Øygarden
        </h1>

        {/* Undertekst */}
        <p className="text-xl text-red-600 mb-6">
          Utforsker teknologi, språk og kreative prosjekter
        </p>
        
        {/* CTA-knapper */}
        <div className="flex justify-center gap-4">
          <Button 
            text="Se mine prosjekter"
            variant="primary"
            size="large"
            onClick={() => window.location.href = '/prosjekter'}
          />
          <Button 
            text="Om meg"
            variant="secondary"
            size="large"
            onClick={() => window.location.href = '/om-meg'}
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection 