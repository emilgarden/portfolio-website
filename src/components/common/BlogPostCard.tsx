import Link from 'next/link';
import Image from 'next/image';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug: string;
}

const BlogPostCard = ({
  title,
  excerpt,
  date,
  readTime,
  imageUrl = '/placeholder-blog.jpg',
  slug
}: BlogPostCardProps) => {
  // Formater dato på en konsistent måte
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Feil ved formatering av dato:', error);
      return dateString; // Returner original streng hvis formatering feiler
    }
  };

  return (
    <Link href={`/blog/${slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Bilde */}
        <div className="h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Innhold */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
            <span>{formatDate(date)}</span>
            <span>•</span>
            <span>{readTime} min lesing</span>
          </div>

          {/* Tittel */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {title}
          </h3>

          {/* Utdrag */}
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>

          {/* Les mer lenke */}
          <div className="inline-flex items-center text-red-600 group-hover:text-red-700 font-medium mt-auto">
            Les mer
            <svg 
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard; 