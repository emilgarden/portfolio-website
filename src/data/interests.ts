import { Interest } from '@/types/interest'
import { Code, Book, Music, Camera, Bike, Coffee } from 'lucide-react'

export const interests: Interest[] = [
  {
    id: 1,
    title: "Programmering",
    description: "Utforsker nye teknologier og bygger kreative løsninger.",
    icon: Code,
    color: "bg-blue-100",
    textColor: "text-blue-700",
    categories: ["Teknologi", "Utvikling"],
    related: ["Web", "AI", "Open Source"]
  }
  // Legg til flere interesser her
] 