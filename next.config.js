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
}

module.exports = nextConfig 