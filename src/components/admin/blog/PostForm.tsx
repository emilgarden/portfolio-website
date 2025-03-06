'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/supabaseClient'
import { BlogPost, BlogPostFormData, BlogCategory } from '@/types/blog'
import RichTextEditor from './RichTextEditor'
import ImageUploader from '../ImageUploader'
import TagSelector from './TagSelector'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface PostFormProps {
  post?: BlogPost;
  isEdit?: boolean;
}

// Hjelpefunksjon for å formatere dato til norsk format for visning
const formatDateToNorwegian = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Hjelpefunksjon for å formatere dato til ISO-format for input[type="datetime-local"]
const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return '';
  
  // Konverter til ISO-format som kreves av datetime-local input
  return new Date(dateString).toISOString().slice(0, 16);
};

// Hjelpefunksjon for å formatere dato fra input til ISO-format
const formatDateFromInput = (dateString: string): string | null => {
  if (!dateString) return null;
  
  // Konverter til ISO-format for lagring i databasen
  return new Date(dateString).toISOString();
};

export default function PostForm({ post, isEdit = false }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featured_image: post?.featured_image || '',
    status: post?.status || 'draft',
    published_at: post?.published_at || null,
    category_id: post?.category_id || null,
    reading_time: post?.reading_time || null,
    is_featured: post?.is_featured || false,
    tag_ids: post?.tags?.map(tagObj => tagObj.tag.id) || []
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      setLoadingCategories(true)
      
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setCategories(data || [])
    } catch (error: any) {
      console.error('Feil ved henting av kategorier:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'published_at' && type === 'datetime-local') {
      // Håndter datokonvertering for publiseringsdato
      setFormData(prev => ({ 
        ...prev, 
        [name]: value ? formatDateFromInput(value) : null 
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Automatisk generere slug fra tittel hvis slug-feltet er tomt
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Fjern spesialtegn
          .replace(/\s+/g, '-') // Erstatt mellomrom med bindestrek
          .replace(/--+/g, '-') // Erstatt flere bindestreker med én
      }))
    }
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
    
    // Beregn lesetid (ca. 200 ord per minutt)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))
    setFormData(prev => ({ ...prev, reading_time: readingTime }))
  }

  const handleTagsChange = (tagIds: (string | number)[]) => {
    setFormData(prev => ({ ...prev, tag_ids: tagIds }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Valider at tittel og slug er fylt ut
      if (!formData.title.trim()) {
        throw new Error('Tittel er påkrevd')
      }
      
      if (!formData.slug.trim()) {
        throw new Error('Slug er påkrevd')
      }
      
      // Sjekk om slug allerede eksisterer (unntatt ved redigering av samme innlegg)
      const { data: existingPost, error: slugCheckError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', formData.slug)
        .single()
      
      if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 = Ingen resultater
        throw slugCheckError
      }
      
      if (existingPost && (!isEdit || existingPost.id !== post?.id)) {
        throw new Error('Et innlegg med denne slug-en eksisterer allerede. Vennligst velg en annen.')
      }
      
      // Forbered data for lagring
      const postData = {
        ...formData,
        // Hvis status er 'published' og published_at er null, sett published_at til nå
        published_at: formData.status === 'published' && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at
      }
      
      let postId = post?.id
      
      if (isEdit) {
        // Oppdater eksisterende innlegg
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            title: postData.title,
            slug: postData.slug,
            content: postData.content,
            excerpt: postData.excerpt,
            featured_image: postData.featured_image,
            status: postData.status,
            published_at: postData.published_at,
            category_id: postData.category_id,
            reading_time: postData.reading_time,
            is_featured: postData.is_featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', post?.id)
        
        if (updateError) throw updateError
      } else {
        // Opprett nytt innlegg
        const { data: newPost, error: insertError } = await supabase
          .from('blog_posts')
          .insert([{
            title: postData.title,
            slug: postData.slug,
            content: postData.content,
            excerpt: postData.excerpt,
            featured_image: postData.featured_image,
            status: postData.status,
            published_at: postData.published_at,
            category_id: postData.category_id,
            reading_time: postData.reading_time,
            is_featured: postData.is_featured
          }])
          .select('id')
          .single()
        
        if (insertError) throw insertError
        postId = newPost.id
      }
      
      // Håndter tagger
      if (postId && postData.tag_ids && postData.tag_ids.length > 0) {
        // Først fjern alle eksisterende tag-koblinger
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', postId)
        
        // Legg til nye tag-koblinger
        const tagConnections = postData.tag_ids.map(tagId => ({
          post_id: postId,
          tag_id: tagId
        }))
        
        const { error: tagError } = await supabase
          .from('blog_post_tags')
          .insert(tagConnections)
        
        if (tagError) throw tagError
      }
      
      toast.success(isEdit ? 'Innlegget ble oppdatert!' : 'Innlegget ble opprettet!')
      router.push('/admin/blog')
    } catch (error: any) {
      console.error('Feil ved lagring av innlegg:', error)
      setError('Kunne ikke lagre innlegg: ' + error.message)
      toast.error('Kunne ikke lagre innlegg: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Tittel */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Tittel *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL-vennlig identifikator for innlegget. Bruk kun små bokstaver, tall og bindestreker.
            </p>
          </div>
          
          {/* Utdrag */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Utdrag
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Kort beskrivelse av innlegget (vises i oversikter)"
            />
          </div>
          
          {/* Hovedbilde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hovedbilde
            </label>
            <ImageUploader
              value={formData.featured_image || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
              bucketName="blog-images"
              folderPath="featured"
            />
          </div>
          
          {/* Innhold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Innhold
            </label>
            <RichTextEditor
              value={formData.content || ''}
              onChange={handleContentChange}
              placeholder="Skriv innlegget ditt her..."
            />
          </div>
          
          {/* Kategori */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <div className="flex">
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="">Velg kategori</option>
                {loadingCategories ? (
                  <option disabled>Laster kategorier...</option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
              <Link 
                href="/admin/blog/categories/new"
                className="ml-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                title="Opprett ny kategori"
                target="_blank"
              >
                <Calendar className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Tagger */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagger
            </label>
            <TagSelector
              selectedTags={formData.tag_ids || []}
              onChange={handleTagsChange}
            />
          </div>
          
          {/* Status og publiseringsdato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="draft">Utkast</option>
                <option value="published">Publisert</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
                Publiseringsdato
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="datetime-local"
                  id="published_at"
                  name="published_at"
                  value={formatDateForInput(formData.published_at)}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
                {formData.published_at && (
                  <div className="text-sm text-gray-600">
                    Norsk format: {formatDateToNorwegian(formData.published_at)}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  La stå tom for å bruke nåværende tidspunkt ved publisering
                </p>
              </div>
            </div>
          </div>
          
          {/* Fremhevet innlegg */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Fremhevet innlegg (vises i fremhevet seksjon)
            </label>
          </div>
          
          {/* Lesetid (kun visning) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimert lesetid
            </label>
            <div className="mt-1 text-sm text-gray-500">
              {formData.reading_time || 0} {formData.reading_time === 1 ? 'minutt' : 'minutter'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/admin/blog/posts')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Lagrer...' : isEdit ? 'Oppdater innlegg' : 'Opprett innlegg'}
        </button>
      </div>
    </form>
  )
} 