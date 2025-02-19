import { ReactNode } from 'react'

export interface Section {
  title: string
  content: ReactNode
}

export interface TabSections {
  about: Section
  experience: Section
  skills: Section
  philosophy: Section
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  category: string
  colorScheme: {
    bg: string
    text: string
  }
} 