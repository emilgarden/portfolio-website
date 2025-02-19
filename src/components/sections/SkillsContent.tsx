const projects = [
  {
    title: "Web Utvikling",
    description: "Frontend og backend utvikling med moderne teknologier og rammeverk.",
    technologies: ["React", "Next.js", "Node.js", "TypeScript"],
    colorScheme: {
      bg: "bg-blue-100",
      text: "text-blue-800"
    }
  },
  {
    title: "Applikasjonsutvikling",
    description: "Utvikling av skalerbare og robuste applikasjoner.",
    technologies: ["Docker", "AWS", "MongoDB", "Redis"],
    colorScheme: {
      bg: "bg-green-100",
      text: "text-green-800"
    }
  },
  {
    title: "Data & Analyse",
    description: "Dataanalyse og visualisering med moderne verktøy.",
    technologies: ["Python", "SQL", "Tableau", "Power BI"],
    colorScheme: {
      bg: "bg-purple-100",
      text: "text-purple-800"
    }
  }
]

const SkillsContent = () => {
  return (
    <div className="space-y-12">
      {projects.map((project, index) => (
        <div key={index}>
          <h3 className="text-2xl font-bold mb-6">{project.title}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className={`px-3 py-1 rounded-full text-sm ${project.colorScheme.bg} ${project.colorScheme.text}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkillsContent 