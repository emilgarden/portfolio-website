'use client'

import { Toaster } from 'react-hot-toast'

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Standard stil for alle toast-meldinger
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
          fontSize: '14px',
        },
        // Spesifikke stiler for ulike typer toast-meldinger
        success: {
          style: {
            background: '#10B981',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#EF4444',
          },
        },
        // Varighet for toast-meldinger (i millisekunder)
        duration: 3000,
      }}
    />
  )
} 