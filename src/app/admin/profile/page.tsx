'use client'

import { useState, useEffect } from 'react'
import supabase from '@/supabaseClient'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ImageUploader from '@/components/admin/ImageUploader'

interface ProfileData {
  id?: number
  name: string
  title: string
  bio: string
  profile_image: string
  social_links: {
    github: string
    linkedin: string
    twitter: string
  }
  created_at?: string
  updated_at?: string
}

export default function ProfileAdmin() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    profile_image: '',
    social_links: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Last inn eksisterende profildata
  useEffect(() => {
    async function checkAuth() {
      const { data, error } = await supabase.auth.getSession()
      console.log('Auth status:', { session: data.session, error })
      
      if (data.session) {
        console.log('User is authenticated:', data.session.user.id)
      } else {
        console.warn('User is NOT authenticated!')
      }
    }
    
    checkAuth()
    
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .eq('id', 1)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // Ingen profil funnet, opprett en ny
            const { error: insertError } = await supabase
              .from('profile')
              .insert([{ 
                id: 1,
                name: '',
                title: '',
                bio: '',
                profile_image: '',
                social_links: {
                  github: '',
                  linkedin: '',
                  twitter: ''
                }
              }])
            
            if (insertError) throw insertError
          } else {
            throw error
          }
        } else if (data) {
          // Sikre at social_links er et objekt med alle nødvendige felter
          const social_links = data.social_links || {}
          setProfileData({
            ...data,
            name: data.name || '',
            title: data.title || '',
            bio: data.bio || '',
            profile_image: data.profile_image || '',
            social_links: {
              github: social_links.github || '',
              linkedin: social_links.linkedin || '',
              twitter: social_links.twitter || ''
            }
          })
        }
      } catch (error: any) {
        console.error('Feil ved lasting av profil:', error)
        toast.error(`Kunne ikke laste profildata: ${error.message || 'Ukjent feil'}`)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Lagre profildata
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profile')
        .upsert({
          id: 1,
          ...profileData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      toast.success('Profil oppdatert!')
    } catch (error: any) {
      console.error('Feil ved lagring av profil:', error)
      toast.error(`Kunne ikke lagre profilen: ${error.message || 'Ukjent feil'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profiladministrasjon</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profilbilde opplasting */}
        <div className="space-y-2">
          <label className="block font-medium">Profilbilde</label>
          <ImageUploader
            value={profileData.profile_image || ''}
            onChange={(url) => setProfileData(prev => ({ ...prev, profile_image: url }))}
            bucketName="profile-images"
            folderPath="profile"
          />
        </div>

        {/* Andre profilfelter */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Navn</label>
            <input
              type="text"
              value={profileData.name || ''}
              onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Ditt navn"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Tittel</label>
            <input
              type="text"
              value={profileData.title || ''}
              onChange={e => setProfileData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="F.eks. Fullstack Utvikler"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              value={profileData.bio || ''}
              onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent h-32"
              placeholder="Skriv litt om deg selv..."
            />
          </div>

          {/* Sosiale medier */}
          <div className="space-y-4">
            <h3 className="font-medium">Sosiale medier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">GitHub</label>
                <input
                  type="url"
                  value={profileData.social_links?.github || ''}
                  onChange={e => setProfileData(prev => ({
                    ...prev,
                    social_links: { 
                      ...(prev.social_links || {}), 
                      github: e.target.value 
                    }
                  }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://github.com/brukernavn"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={profileData.social_links?.linkedin || ''}
                  onChange={e => setProfileData(prev => ({
                    ...prev,
                    social_links: { 
                      ...(prev.social_links || {}), 
                      linkedin: e.target.value 
                    }
                  }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://linkedin.com/in/brukernavn"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Twitter</label>
                <input
                  type="url"
                  value={profileData.social_links?.twitter || ''}
                  onChange={e => setProfileData(prev => ({
                    ...prev,
                    social_links: { 
                      ...(prev.social_links || {}), 
                      twitter: e.target.value 
                    }
                  }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://twitter.com/brukernavn"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Lagrer...
              </>
            ) : (
              'Lagre endringer'
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 