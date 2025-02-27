import { Interest } from '@/types/interest'
import { Code, Book, Music, Camera, Bike, Coffee, Globe, Gamepad } from 'lucide-react'

export const interests: Interest[] = [
  {
    id: 1,
    title: "Programmering",
    description: "Utforsker nye teknologier og bygger kreative løsninger. Spesielt interessert i webutvikling og AI.",
    icon: Code,
    color: "bg-blue-100",
    textColor: "text-blue-700",
    categories: ["Teknologi", "Utvikling"],
    related: ["Web", "AI", "Open Source"]
  },
  {
    id: 2,
    title: "Lesing",
    description: "Fordyper meg i fagbøker om teknologi og personlig utvikling, samt skjønnlitteratur.",
    icon: Book,
    color: "bg-green-100",
    textColor: "text-green-700",
    categories: ["Læring", "Hobby"],
    related: ["Bøker", "Personlig utvikling", "Teknologi"]
  },
  {
    id: 3,
    title: "Musikk",
    description: "Spiller gitar og lytter til alt fra rock til klassisk. Musikk er en viktig del av hverdagen min.",
    icon: Music,
    color: "bg-purple-100",
    textColor: "text-purple-700",
    categories: ["Kunst", "Hobby"],
    related: ["Gitar", "Konserter", "Produksjon"]
  },
  {
    id: 4,
    title: "Fotografi",
    description: "Fanger øyeblikk og utforsker verden gjennom kameralinsen. Fokuserer på natur- og gatebilder.",
    icon: Camera,
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
    categories: ["Kunst", "Hobby"],
    related: ["Redigering", "Komposisjon", "Utstyr"]
  },
  {
    id: 5,
    title: "Sykling",
    description: "Utforsker nye steder på to hjul. Både landeveissykling og terrengsykling gir meg energi.",
    icon: Bike,
    color: "bg-red-100",
    textColor: "text-red-700",
    categories: ["Sport", "Friluftsliv"],
    related: ["Trening", "Natur", "Utstyr"]
  },
  {
    id: 6,
    title: "Kaffe",
    description: "Utforsker ulike kaffebønner og bryggemetoder. En god kopp kaffe starter dagen perfekt.",
    icon: Coffee,
    color: "bg-amber-100",
    textColor: "text-amber-700",
    categories: ["Mat", "Hobby"],
    related: ["Brygging", "Bønner", "Utstyr"]
  },
  {
    id: 7,
    title: "Reising",
    description: "Opplever nye kulturer og steder. Reising utvider horisonten og gir nye perspektiver.",
    icon: Globe,
    color: "bg-indigo-100",
    textColor: "text-indigo-700",
    categories: ["Opplevelser", "Kultur"],
    related: ["Språk", "Mat", "Arkitektur"]
  },
  {
    id: 8,
    title: "Gaming",
    description: "Spiller strategispill og rollespill. Gaming er både underholdning og en måte å koble av på.",
    icon: Gamepad,
    color: "bg-teal-100",
    textColor: "text-teal-700",
    categories: ["Teknologi", "Hobby"],
    related: ["Strategi", "RPG", "Indie"]
  }
] 