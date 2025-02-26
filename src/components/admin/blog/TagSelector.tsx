'use client'

import { useState, useEffect, useRef } from 'react'
import supabase from '@/supabaseClient'
import { BlogTag } from '@/types/blog'
import { X, Plus } from 'lucide-react'
import Link from 'next/link'

interface TagSelectorProps {
  selectedTags: (string | number)[]
  onChange: (tags: (string | number)[]) => void
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    // Legg til event listener for å lukke dropdown når man klikker utenfor
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    // Legg til event listener når dropdown er åpen
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Fjern event listener når komponenten unmountes eller dropdown lukkes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  async function fetchTags() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setTags(data || [])
    } catch (error: any) {
      console.error('Feil ved henting av tagger:', error)
      setError('Kunne ikke hente tagger: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTagSelect = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId])
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleTagRemove = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId))
  }

  const filteredTags = tags.filter(tag => 
    !selectedTags.includes(tag.id) && 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id))

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTagObjects.map(tag => (
          <div 
            key={tag.id} 
            className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm"
          >
            <span>{tag.name}</span>
            <button 
              type="button"
              onClick={() => handleTagRemove(tag.id)}
              className="ml-1 text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Søk etter tagger..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          <Link 
            href="/admin/blog/tags/new"
            className="ml-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            title="Opprett ny tagg"
            target="_blank"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
        
        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
            {loading ? (
              <div className="p-2 text-center text-gray-500">Laster...</div>
            ) : filteredTags.length === 0 ? (
              <div className="p-2 text-center text-gray-500">
                {searchTerm ? 'Ingen tagger funnet' : 'Ingen flere tagger tilgjengelig'}
              </div>
            ) : (
              <ul>
                {filteredTags.map(tag => (
                  <li 
                    key={tag.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 