export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  githubUrl?: string
  liveUrl?: string
  slug: string
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  readingTime: string
  categories: string[]
  tags: string[]
  featured?: boolean
  slug: string
} 