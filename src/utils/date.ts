/**
 * Formatterer en dato til norsk format (dag måned år)
 */
export function formatDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Feil ved formatering av dato:', error)
    return typeof dateString === 'string' ? dateString : dateString.toString()
  }
} 