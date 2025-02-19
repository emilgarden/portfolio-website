'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setSelectedCategory } from '@/store/projectsSlice'

interface ProjectFilterProps {
  categories: string[]
}

const ProjectFilter = ({ categories }: ProjectFilterProps) => {
  const dispatch = useAppDispatch()
  const selectedCategory = useAppSelector(state => state.projects.selectedCategory)

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => dispatch(setSelectedCategory(null))}
          className={`
            px-4 py-2 rounded-md transition-colors
            ${selectedCategory === null
              ? 'bg-black text-white'
              : 'bg-gray-100 hover:bg-red-600 hover:text-white'
            }
          `}
        >
          Alle
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => dispatch(setSelectedCategory(category))}
            className={`
              px-4 py-2 rounded-md transition-colors
              ${selectedCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-red-600 hover:text-white'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProjectFilter 