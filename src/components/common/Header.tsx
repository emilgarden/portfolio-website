'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Hjem', href: '/' },
  { name: 'Prosjekter', href: '/prosjekter' },
  { name: 'Blogg', href: '/blogg' }
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black">
      <nav className="container-wrapper">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-white font-bold text-xl hover:text-red-500 transition-colors"
          >
            Ole Emil
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-md
                  transition-all duration-200 group
                  ${pathname === item.href
                    ? 'text-white'
                    : 'text-gray-300 hover:text-black'
                  }
                `}
              >
                <span className="relative z-10">{item.name}</span>
                <div
                  className={`
                    absolute inset-0 rounded-md transition-all duration-200
                    ${pathname === item.href
                      ? 'bg-red-600'
                      : 'bg-transparent group-hover:bg-white'
                    }
                  `}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-white hover:text-red-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Åpne meny</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative block px-3 py-2 text-base font-medium rounded-md
                    transition-all duration-200 group
                    ${pathname === item.href
                      ? 'text-white'
                      : 'text-gray-300 hover:text-black'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div
                    className={`
                      absolute inset-0 rounded-md transition-all duration-200
                      ${pathname === item.href
                        ? 'bg-red-600'
                        : 'bg-transparent group-hover:bg-white'
                      }
                    `}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header 