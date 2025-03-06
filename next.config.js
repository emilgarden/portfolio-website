/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['naflrnnechidtzotrivd.supabase.co'],
  },
  // Legg til dette for å unngå problemer med Supabase Auth
  experimental: {
    serverActions: { mode: "server" },
  },
  // Deaktiver ESLint og TypeScript-sjekk under bygget
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Miljøvariabler som skal være tilgjengelige under bygget
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key',
  },
}

module.exports = nextConfig 