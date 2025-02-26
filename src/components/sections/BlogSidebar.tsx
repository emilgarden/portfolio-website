'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setSearchQuery, setSelectedTags, setSelectedCategory } from '@/store/blogSlice'
import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { debounce } from '@/utils/performance'
import { Search, ChevronDown } from 'lucide-react'

interface BlogSidebarProps {
  categories: string[]
  tags: string[]
  activeCategory: string | null
  activeTag: string | null
  onCategoryClick: (category: string | null) => void
  onTagClick: (tag: string | null) => void
  onClearFilters: () => void
}

const BlogSidebar = ({
  categories,
  tags,
  activeCategory,
  activeTag,
  onCategoryClick,
  onTagClick,
  onClearFilters
}: BlogSidebarProps) => {
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

      {/* Kategorier */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Kategorier</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => onCategoryClick(activeCategory === category ? null : category)}
                className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
                  activeCategory === category ? 'bg-red-100 text-red-800 font-medium' : ''
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tagger */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Tagger</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTag === tag
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } transition-colors`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Nullstill filtre */}
      {(activeCategory || activeTag) && (
        <div className="pt-4">
          <button
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Nullstill filtre
          </button>
        </div>
      )}
    </aside>
  )
}

export default BlogSidebar 