import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialiser Supabase-klienten
let supabase;

// Sjekk om miljøvariabler er satt
if (!supabaseUrl || !supabaseAnonKey) {
  // Under bygget eller hvis miljøvariabler mangler, bruk dummy-verdier
  if (process.env.NODE_ENV === 'production') {
    console.warn('Supabase-miljøvariabler mangler. Bruker dummy-verdier for bygget.');
    // Bruk dummy-verdier som vil feile ved faktisk bruk, men tillate bygget
    const dummyUrl = 'https://example.supabase.co';
    const dummyKey = 'dummy-key';
    supabase = createClient(dummyUrl, dummyKey);
  } else {
    // I utvikling, kast feil for å gjøre det tydelig at miljøvariabler mangler
    throw new Error('Supabase URL og Anon Key må være definert i miljøvariablene.');
  }
} else {
  // Miljøvariabler er satt, opprett Supabase-klienten
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase; 