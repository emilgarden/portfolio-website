/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#EF4444',
        },
        secondary: {
          DEFAULT: '#000000',
          gray: '#1F2937',
        },
        background: {
          light: '#FFF1F2', // veldig lys rosa
          gray: '#F9FAFB', // lys grå
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'emoji-float': 'emojiFloat 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        emojiFloat: {
          '0%': { transform: 'translate(0, 0) scale(0.5)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translate(0, -100px) scale(1.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} 