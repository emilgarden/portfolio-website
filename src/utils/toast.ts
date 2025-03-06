import { toast, ToastOptions } from 'react-hot-toast'

// Standard meldinger
const defaultMessages = {
  success: {
    create: 'Opprettet!',
    update: 'Oppdatert!',
    delete: 'Slettet!',
    save: 'Lagret!',
    upload: 'Lastet opp!'
  },
  error: {
    create: 'Kunne ikke opprette',
    update: 'Kunne ikke oppdatere',
    delete: 'Kunne ikke slette',
    save: 'Kunne ikke lagre',
    upload: 'Kunne ikke laste opp',
    load: 'Kunne ikke laste inn'
  }
}

// Hjelpefunksjoner for toast-meldinger
export const showToast = {
  // Suksess-meldinger
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options)
  },
  
  // Feil-meldinger
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options)
  },
  
  // Laste-meldinger
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, options)
  },
  
  // Vanlige meldinger
  info: (message: string, options?: ToastOptions) => {
    toast(message, options)
  },
  
  // Avslutt en laste-melding med suksess
  loadingSuccess: (toastId: string, message: string, options?: ToastOptions) => {
    toast.dismiss(toastId)
    toast.success(message, options)
  },
  
  // Avslutt en laste-melding med feil
  loadingError: (toastId: string, message: string, options?: ToastOptions) => {
    toast.dismiss(toastId)
    toast.error(message, options)
  }
}

// Eksporter standard meldinger
export { defaultMessages } 