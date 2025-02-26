export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  technologies?: string[];
  category?: string;
  github_url?: string;
  live_url?: string;
  project_type?: string;
  featured: boolean;
  status: 'draft' | 'published';
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  image_url: string;
  technologies: string[];
  category: string;
  github_url: string;
  live_url: string;
  project_type: string;
  featured: boolean;
  status: 'draft' | 'published';
  sort_order: number;
} 