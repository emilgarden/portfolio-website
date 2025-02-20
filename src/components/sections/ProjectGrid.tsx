import ProjectCard from '../common/ProjectCard'
import { Project } from '@/types/project'

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="py-16">
      <div className="container-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description ?? ''}
              technologies={project.technologies ?? []}
              imageUrl={project.image_url ?? '/placeholder-project.jpg'}
              githubUrl={project.github_url ?? undefined}
              liveUrl={project.live_url ?? undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 