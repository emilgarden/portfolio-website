'use client'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { Interest } from '@/types/interest'
import VirtualList from '@/components/common/VirtualList'
import { useState, useMemo } from 'react'
import { debounce } from '@/utils/performance'

interface InterestCardProps {
  interest: Interest
  onHover: (categories: string[]) => void
}

const InterestCard = ({ interest, onHover }: InterestCardProps) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  })

  const handleMouseEnter = useMemo(
    () => debounce(() => onHover(interest.categories), 100),
    [interest.categories, onHover]
  )

  const handleMouseLeave = useMemo(
    () => debounce(() => onHover([]), 100),
    [onHover]
  )

  const Icon = interest.icon

  return (
    <article 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`
        p-6 rounded-lg transition-all duration-300
        ${interest.color} ${interest.textColor}
        transform hover:-translate-y-1 hover:shadow-lg
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: entry?.isIntersecting ? 1 : 0,
        transform: entry?.isIntersecting ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
      }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">
            {interest.title}
          </h3>
          <p className="mb-4 text-opacity-90">
            {interest.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {interest.related.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-white/20 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

const InterestGrid = ({ interests }: { interests: Interest[] }) => {
  const [highlightedCategories, setHighlightedCategories] = useState<string[]>([])

  const handleInterestHover = (categories: string[]) => {
    setHighlightedCategories(categories)
  }

  return (
    <div className="space-y-12">
      {/* Kategori-indikator */}
      {highlightedCategories.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-300">
          <div className="flex gap-2">
            {highlightedCategories.map(category => (
              <span key={category} className="text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      <VirtualList
        items={interests}
        itemHeight={200} // Juster denne verdien basert på faktisk korthøyde
        containerHeight={800} // Juster denne verdien basert på ønsket containerhøyde
        renderItem={(interest) => (
          <InterestCard 
            key={interest.id} 
            interest={interest}
            onHover={handleInterestHover}
          />
        )}
      />
    </div>
  )
}

export default InterestGrid 