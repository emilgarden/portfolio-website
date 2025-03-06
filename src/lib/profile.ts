import supabase from '@/supabaseClient'

export interface ProfileData {
  id: number
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

export async function getProfileData(): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error) {
      console.error('Feil ved henting av profildata:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Feil ved henting av profildata:', error)
    return null
  }
} 