'use client'

import Link from 'next/link'
import Image from 'next/image'

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  slug?: string;
}

const ProjectCard = ({ 
  title, 
  description, 
  technologies, 
  imageUrl = '/placeholder-project.jpg',
  githubUrl,
  liveUrl,
  slug
}: ProjectCardProps) => {
  // Bestem hvor kortet skal lenke til
  const getCardLink = () => {
    if (slug) return `/prosjekter/${slug}`;
    if (liveUrl) return liveUrl;
    if (githubUrl) return githubUrl;
    return '#';
  };

  const cardLink = getCardLink();
  const isExternalLink = cardLink.startsWith('http');

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Wrapper for hele kortet som en lenke */}
      <Link 
        href={cardLink}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        className="block h-full"
      >
        {/* Bilde */}
        <div className="h-48 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={title}
            width={500}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Innhold */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>

          {/* Teknologier */}
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Lenker */}
          <div className="flex gap-4 mt-auto">
            {githubUrl && (
              <span 
                className="text-gray-600 hover:text-red-600 transition-colors inline-flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(githubUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                GitHub →
              </span>
            )}
            {liveUrl && (
              <span 
                className="text-gray-600 hover:text-red-600 transition-colors inline-flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(liveUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                Se live →
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard; 