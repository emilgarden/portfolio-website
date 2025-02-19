'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setSearchQuery, setSelectedTags, setSelectedCategory } from '@/store/blogSlice'
import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { debounce } from '@/utils/performance'
import { Search, ChevronDown } from 'lucide-react'

interface BlogSidebarProps {
  categories: string[]
  tags: string[]
}

const BlogSidebar = ({ categories, tags }: BlogSidebarProps) => {
  const dispatch = useAppDispatch()
  const { searchQuery, selectedTags, selectedCategory } = useAppSelector(state => state.blog)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Håndter klikk utenfor dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounce søk for å unngå for mange Redux-oppdateringer
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      dispatch(setSearchQuery(value))
    }, 300),
    [dispatch]
  )

  // Håndter søkeinput med lokal state for bedre UX
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    debouncedSearch(value)
  }, [debouncedSearch])

  // Memoizer tag-toggle funksjonen
  const toggleTag = useCallback((tag: string) => {
    if (selectedTags.includes(tag)) {
      dispatch(setSelectedTags(selectedTags.filter(t => t !== tag)))
    } else {
      dispatch(setSelectedTags([...selectedTags, tag]))
    }
  }, [dispatch, selectedTags])

  const handleCategorySelect = (category: string | null) => {
    dispatch(setSelectedCategory(category))
    setIsDropdownOpen(false)
  }

  return (
    <aside className="space-y-8">
      {/* Søk */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          Søk
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Søk i blogginnlegg..."
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 rounded-lg border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Kategorier Dropdown */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Kategorier
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-3 rounded-lg border border-gray-200 bg-white
                     flex items-center justify-between
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <span className="text-gray-700">
              {selectedCategory || 'Velg kategori'}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200
                         ${isDropdownOpen ? 'transform rotate-180' : ''}`}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`
                  w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors
                  ${!selectedCategory ? 'text-red-600' : 'text-gray-700'}
                `}
              >
                Alle kategorier
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`
                    w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors
                    ${selectedCategory === category ? 'text-red-600' : 'text-gray-700'}
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-1 rounded-full text-sm transition-colors
                ${selectedTags.includes(tag)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default BlogSidebar 