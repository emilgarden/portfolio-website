'use client'

import { useCallback, useMemo } from 'react'
import { throttle } from '@/utils/performance'
import { TabSections } from '@/types/about'

interface TabNavigationProps {
  sections: TabSections
  activeSection: keyof TabSections
  onTabChange: (section: keyof TabSections) => void
}

const TabNavigation = ({ sections, activeSection, onTabChange }: TabNavigationProps) => {
  // Memoizer seksjonsnøklene for å unngå unødvendige re-renders
  const sectionKeys = useMemo(() => Object.keys(sections) as (keyof TabSections)[], [sections])

  // Throttle tab-endringer for å unngå for mange oppdateringer
  const handleTabChange = useCallback(
    throttle((section: keyof TabSections) => {
      onTabChange(section)
      // Smooth scroll til toppen av innholdet
      document.querySelector('.tab-content')?.scrollIntoView({ behavior: 'smooth' })
    }, 200),
    [onTabChange]
  )

  // Keyboard navigation
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent,
    section: keyof TabSections
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTabChange(section)
    }
  }, [handleTabChange])

  return (
    <div 
      className="flex overflow-x-auto hide-scrollbar"
      role="tablist"
      aria-label="Innholdsseksjoner"
    >
      {sectionKeys.map((section) => (
        <button
          key={section}
          role="tab"
          aria-selected={activeSection === section}
          aria-controls={`${section}-panel`}
          id={`${section}-tab`}
          onClick={() => handleTabChange(section)}
          onKeyDown={(e) => handleKeyDown(e, section)}
          className={`
            relative px-6 py-4 text-sm font-medium whitespace-nowrap
            transition-colors duration-200
            focus:outline-none
            ${activeSection === section
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-900'
            }
          `}
        >
          {sections[section].title}
          {activeSection === section && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
      ))}
    </div>
  )
}

export default TabNavigation 