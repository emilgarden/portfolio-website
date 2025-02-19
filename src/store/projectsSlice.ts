import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Project } from '@/types'

interface ProjectsState {
  items: Project[]
  selectedCategory: string | null
  isLoading: boolean
  error: string | null
}

const initialState: ProjectsState = {
  items: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.items = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setProjects, setSelectedCategory, setLoading, setError } = projectsSlice.actions
export default projectsSlice.reducer 