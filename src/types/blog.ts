export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogCategoryFormData {
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogTagFormData {
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  image?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  status: 'published' | 'draft';
  reading_time?: number;
  readingTime?: string;
  date?: string;
  category_id?: string | number;
  category?: { id: string | number; name: string };
  categories?: string[];
  tags?: Array<{ tag: { id: string | number; name: string } }>;
  is_featured?: boolean;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: 'draft' | 'published';
  published_at: string | null;
  category_id: string | number | null;
  reading_time: number | null;
  is_featured: boolean;
  tag_ids?: (string | number)[];
} 