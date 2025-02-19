'use client'

import OptimizedImage from '@/components/common/OptimizedImage'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const HomeHero = () => {
  return (
    <section className="relative pt-3 md:pt-4 pb-8">
      <div className="container-wrapper -mt-8 md:-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Hei, jeg er{' '}
              <span className="text-gradient">
                Ole Emil
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Frontend-utvikler med fokus på brukeropplevelse og moderne webutvikling.
              Jeg skaper responsive og brukervennlige nettsider med React og Next.js.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/prosjekter"
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg
                         hover:bg-red-700 transition-colors"
              >
                Se mine prosjekter
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/om-meg"
                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-900 rounded-lg
                         hover:bg-gray-200 transition-colors"
              >
                Les mer om meg
              </Link>
            </div>
          </div>

          <div className="relative aspect-square w-48 md:w-64 lg:w-80 mx-auto">
            <OptimizedImage
              src="/images/profile.jpg"
              alt="Ole Emil Øygarden"
              priority
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero 