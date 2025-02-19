import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlogPost } from '@/types/blog'

interface BlogState {
  posts: BlogPost[]
  searchQuery: string
  selectedTags: string[]
  selectedCategory: string | null
  isLoading: boolean
  error: string | null
}

const initialState: BlogState = {
  posts: [],
  searchQuery: '',
  selectedTags: [],
  selectedCategory: null,
  isLoading: false,
  error: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  setPosts,
  setSearchQuery,
  setSelectedTags,
  setSelectedCategory,
  setLoading,
  setError
} = blogSlice.actions

export default blogSlice.reducer 