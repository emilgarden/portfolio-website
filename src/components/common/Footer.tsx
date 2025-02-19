'use client'

import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/oleemil', icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/oleemil', icon: 'linkedin' },
    { name: 'Twitter', url: 'https://twitter.com/oleemil', icon: 'twitter' },
  ]

  const quickLinks = [
    { name: 'Hjem', path: '/' },
    { name: 'Prosjekter', path: '/prosjekter' },
    { name: 'Blogg', path: '/blogg' },
    { name: 'Om Meg', path: '/om-meg' },
    { name: 'Kontakt', path: '/kontakt' },
  ]

  const latestPosts = [
    { title: 'Hvordan jeg bygget min portfolio', path: '/blogg/portfolio-build' },
    { title: 'Utforsking av moderne webutvikling', path: '/blogg/modern-web-dev' },
    { title: 'Mine favorittverktøy for koding', path: '/blogg/favorite-tools' },
  ]

  const SocialIcon = ({ icon }: { icon: string }) => {
    const icons = {
      github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    }
    return icons[icon as keyof typeof icons] || null
  }

  return (
    <footer className="bg-black text-white">
      {/* Hovedinnhold */}
      <div className="container-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Om Meg */}
          <div>
            <h3 className="text-lg font-bold mb-4">Om Meg</h3>
            <p className="text-gray-400 mb-4">
              Jeg er en utvikler med lidenskap for å skape elegante og effektive løsninger. 
              Utforsker stadig nye teknologier og deler mine erfaringer.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Raske Lenker */}
          <div>
            <h3 className="text-lg font-bold mb-4">Raske Lenker</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Siste Innlegg */}
          <div>
            <h3 className="text-lg font-bold mb-4">Siste Innlegg</h3>
            <ul className="space-y-2">
              {latestPosts.map((post) => (
                <li key={post.path}>
                  <Link
                    href={post.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Oslo, Norge
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href="mailto:kontakt@oleemil.no" 
                  className="hover:text-white transition-colors"
                >
                  kontakt@oleemil.no
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container-wrapper py-8">
          <p className="text-center text-gray-400">
            © {currentYear} Ole Emil Øygarden. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 