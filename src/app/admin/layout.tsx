'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import supabase from '@/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      try {
        console.log('Sjekker autentisering...')
        setLoading(true)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Feil ved henting av sesjon:', error)
          throw error
        }
        
        console.log('Sesjon:', session ? 'Funnet' : 'Ikke funnet')
        
        if (!session) {
          // Bare omdiriger hvis vi ikke allerede er på innloggingssiden
          if (pathname !== '/admin/auth/login') {
            console.log('Ingen sesjon funnet, omdirigerer til innlogging')
            router.push('/admin/auth/login')
          }
          setLoading(false)
          return
        }
        
        setUser(session.user)
        setLoading(false)
      } catch (error) {
        console.error('Feil ved autentisering:', error)
        setLoading(false)
        if (pathname !== '/admin/auth/login') {
          router.push('/admin/auth/login')
        }
      }
    }
    
    getUser()
  }, [pathname, router])

  // Hvis vi er på innloggingssiden, vis bare innholdet uten admin-layout
  if (pathname === '/admin/auth/login') {
    return <>{children}</>
  }

  // Navigasjonslenker for admin
  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Prosjekter', href: '/admin/projects' },
    { name: 'Blogg', href: '/admin/blog' },
    { name: 'Profil', href: '/admin/profile' }
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topplinje */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Portfolio Admin</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button 
              onClick={handleSignOut}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidemeny */}
        <aside className="w-64 bg-white shadow-sm h-screen p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 rounded-md ${
                  pathname === item.href
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Hovedinnhold */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 