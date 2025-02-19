'use client'

import { useState } from 'react';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'OEØ' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { text: 'Hjem', href: '/' },
    { text: 'Prosjekter', href: '/prosjekter' },
    { text: 'Blogg', href: '/blogg' },
    { text: 'Interesser', href: '/interesser' },
    { text: 'Om Meg', href: '/om-meg' },
  ];

  return (
    <header className="bg-gray-900 text-white">
      <div className="container-wrapper">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="text-xl font-bold z-10">
            {title}
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.text}
                href={item.href}
                className="hover:bg-red-700 px-4 py-2 transition-colors"
              >
                {item.text}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 bg-red-600 rounded-full flex items-center justify-center z-10"
            aria-label="Toggle menu"
          >
            <div className={`relative w-5 h-5 transform transition-all duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}>
              {/* Vertical line */}
              <div className={`absolute w-0.5 h-5 bg-black left-1/2 transform -translate-x-1/2 transition-all duration-300`}></div>
              {/* Horizontal line */}
              <div className={`absolute h-0.5 w-5 bg-black top-1/2 transform -translate-y-1/2 transition-all duration-300`}></div>
            </div>
          </button>

          {/* Mobile Menu */}
          <div className={`
            fixed inset-0 bg-gray-900 transition-transform duration-300 md:hidden
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {menuItems.map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  className="text-xl hover:bg-red-700 px-6 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;