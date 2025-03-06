import { createClient } from '@supabase/supabase-js'

// ADVARSEL: Dette er kun for testing og bør ALDRI brukes på klientsiden i produksjon
// Service role key har full tilgang til databasen og omgår RLS
// Denne klienten bør kun brukes i sikre miljøer (server-side)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Sjekk om vi er i et sikkert miljø (server-side)
const isServerSide = typeof window === 'undefined'

// Opprett admin-klienten kun hvis vi er på server-siden
const supabaseAdmin = isServerSide
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export default supabaseAdmin 