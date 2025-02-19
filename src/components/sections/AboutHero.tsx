import Image from 'next/image'

export default function AboutHero() {
  return (
    <section className="bg-rose-50/40 py-16 mt-16">
      <div className="container-wrapper">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Om Meg
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Frontend-utvikler med fokus på brukeropplevelse og moderne webutvikling. 
            Her kan du lære mer om min bakgrunn og erfaring.
          </p>
        </div>
      </div>
    </section>
  )
} 