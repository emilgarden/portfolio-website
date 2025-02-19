const experiences = [
  {
    title: "Senior Fullstack Utvikler",
    company: "TechCorp AS",
    period: "2021 - Nå",
    description: "Leder utviklingen av selskapets hovedprodukt, en skybasert SaaS-løsning. Ansvarlig for arkitektur og tekniske beslutninger.",
    technologies: ["React", "Node.js", "AWS", "TypeScript"]
  },
  {
    title: "Frontend Utvikler",
    company: "WebSolutions Norge",
    period: "2019 - 2021",
    description: "Utviklet responsive web-applikasjoner for diverse kunder. Fokus på brukeropplevelse og ytelse.",
    technologies: ["Vue.js", "Nuxt.js", "SCSS", "JavaScript"]
  },
  {
    title: "Junior Utvikler",
    company: "StartupHub",
    period: "2018 - 2019",
    description: "Fullstack utvikling for tidligfase startups. Varierte prosjekter fra MVP til produksjonsklare løsninger.",
    technologies: ["React", "Express", "MongoDB", "Docker"]
  }
]

const ExperienceContent = () => {
  return (
    <div className="space-y-12">
      {experiences.map((exp, index) => (
        <div 
          key={index}
          className="relative pl-8 border-l-2 border-gray-200"
        >
          <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-[9px] top-0" />
          
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">{exp.title}</h3>
              <span className="text-gray-600">{exp.period}</span>
            </div>
            <div className="text-lg text-gray-600 mb-2">{exp.company}</div>
          </div>
          
          <p className="text-gray-600 mb-4">
            {exp.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map(tech => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExperienceContent 