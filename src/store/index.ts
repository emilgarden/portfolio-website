import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from './projectsSlice'
import blogReducer from './blogSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    blog: blogReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 