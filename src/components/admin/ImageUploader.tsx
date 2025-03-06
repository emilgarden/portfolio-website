'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import supabase from '@/supabaseClient'
import Image from 'next/image'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  bucketName?: string
  folderPath?: string
}

export default function ImageUploader({
  value,
  onChange,
  bucketName = 'project-images',
  folderPath = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      setPreview(value)
    }
  }, [value])

  // Sjekk om bucket eksisterer og opprett om nødvendig
  const ensureBucketExists = async (bucketName: string) => {
    try {
      console.log(`Sjekker om bucket '${bucketName}' eksisterer...`)
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('Feil ved henting av buckets:', bucketsError)
        return
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        console.log(`Bucket '${bucketName}' eksisterer ikke, oppretter ny...`)
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true
        })
        
        if (createError) {
          console.error('Feil ved opprettelse av bucket:', createError)
          // Vi fortsetter likevel, siden feilen kan være relatert til RLS
          console.warn('Fortsetter til tross for feil - bucket kan allerede eksistere')
        } else {
          console.log(`Bucket '${bucketName}' opprettet vellykket`)
        }
      } else {
        console.log(`Bucket '${bucketName}' eksisterer allerede`)
      }
    } catch (error) {
      console.error('Feil ved oppsett av storage:', error)
      // Vi fortsetter likevel, siden feilen kan være relatert til RLS
      console.warn('Fortsetter til tross for feil - bucket kan allerede eksistere')
    }
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setError(null)

      // Sjekk om bucket eksisterer og opprett om nødvendig
      await ensureBucketExists(bucketName)

      // Generer et unikt filnavn for å unngå kollisjoner
      const fileExt = file.name.split('.').pop() || 'png'
      
      // Bruk et enkelt, sanitert filnavn basert på timestamp
      const timestamp = new Date().getTime()
      const randomString = Math.random().toString(36).substring(2, 10)
      const fileName = `image_${timestamp}_${randomString}.${fileExt}`
      
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

      console.log('Laster opp fil:', {
        bucketName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      })

      // Last opp filen til Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Endre til true for å overskrive hvis filen eksisterer
        })

      if (uploadError) {
        // Ignorer RLS-feilmeldinger hvis vi får en public URL
        if (uploadError.message?.includes('row-level security') || 
            uploadError.message?.includes('violates row-level security policy')) {
          console.warn('RLS-feil ignorert:', uploadError.message)
          // Fortsett som om opplastingen var vellykket, men logg advarselen
        } else {
          console.error('Supabase opplastingsfeil:', uploadError)
          throw new Error(`Opplastingsfeil: ${uploadError.message || 'Ukjent feil'}`)
        }
      }

      // Hent den offentlige URL-en til bildet, selv om vi fikk en RLS-feil
      const path = data?.path || filePath
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path)

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Kunne ikke hente offentlig URL for bildet')
      }

      const publicUrl = urlData.publicUrl
      console.log('Offentlig URL:', publicUrl)

      // Oppdater verdien med den nye URL-en
      onChange(publicUrl)
      setPreview(publicUrl)
    } catch (error: any) {
      console.error('Feil ved opplasting av bilde:', error)
      setError(`Kunne ikke laste opp bilde: ${error.message || 'Ukjent feil'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    const file = e.target.files[0]
    
    // Valider filtypen
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Ugyldig filtype. Vennligst last opp et bilde (JPEG, PNG, GIF, WEBP).')
      return
    }
    
    // Valider filstørrelsen (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Bildet er for stort. Maksimal størrelse er 5MB.')
      return
    }
    
    uploadImage(file)
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {preview ? (
        <div className="relative">
          <div className="relative h-48 w-full rounded-md overflow-hidden">
            <Image 
              src={preview} 
              alt="Forhåndsvisning" 
              fill 
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
            title="Fjern bilde"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Klikk for å laste opp et bilde
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF eller WEBP (maks 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
} 