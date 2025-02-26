/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['naflrnnechidtzotrivd.supabase.co'],
  },
  // Legg til dette for å unngå problemer med Supabase Auth
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 