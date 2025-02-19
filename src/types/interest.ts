import { LucideIcon } from 'lucide-react'

export interface Interest {
  id: number
  title: string
  description: string
  icon: LucideIcon
  color: string
  textColor: string
  categories: string[]
  related: string[]
} 