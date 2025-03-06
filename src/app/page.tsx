import Link from 'next/link'
import Header from '@/components/common/Header';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlogSection from '@/components/sections/BlogSection';
import supabase from '@/supabaseClient'
import { BlogPost } from '@/types/blog'
import HomeHero from '@/components/sections/HomeHero';
import { getProfileData } from '@/lib/profile';

// Hent de nyeste blogginnleggene for forsiden
async function getLatestBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name)
    `)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(3)
  
  if (error) {
    console.error('Feil ved henting av blogginnlegg:', error)
    return []
  }
  
  return data || []
}

export default async function Home() {
  // Hent de nyeste blogginnleggene
  const latestPosts = await getLatestBlogPosts()
  
  // Hent profildata
  const profileData = await getProfileData()
  
  // Konverter til formatet som BlogSection forventer
  const formattedPosts = latestPosts.map(post => ({
    id: post.id,
    title: post.title,
    description: post.excerpt || '',
    date: post.published_at || post.created_at,
    readTime: `${post.reading_time || 5} min`,
    tags: post.category ? [post.category.name] : [],
    imageUrl: post.featured_image || '/images/blog/placeholder.jpg',
    slug: post.slug
  }))

  return (
    <>
      <Header />
      <main className="pt-16">
        <HomeHero profileData={profileData} />
        <ProjectsSection />
        <BlogSection posts={formattedPosts} />
      </main>
    </>
  );
}