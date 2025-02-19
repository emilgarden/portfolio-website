import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio Nettside",
    description: "Min personlige portfolio bygget med Next.js og Tailwind CSS.",
    image: "/images/projects/portfolio.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Web Utvikling",
    githubUrl: "https://github.com/username/portfolio",
    liveUrl: "https://portfolio.no",
    slug: "portfolio-website"
  }
  // Legg til flere prosjekter her
] 