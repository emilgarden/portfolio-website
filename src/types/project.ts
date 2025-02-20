export type Project = {
  id: string
  title: string
  description: string | null
  short_description: string | null
  image_url: string | null
  technologies: string[]
  category: string | null
  github_url: string | null
  live_url: string | null
  slug: string
  featured: boolean
  status: string
  sort_order: number | null
  created_at: string
  updated_at: string
} 