interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

const BlogPostCard = ({
  title,
  excerpt,
  date,
  readTime,
  imageUrl = '/placeholder-blog.jpg'
}: BlogPostCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Bilde */}
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Innhold */}
      <div className="p-6">
        {/* Metadata */}
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime} min lesing</span>
        </div>

        {/* Tittel */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors">
          {title}
        </h3>

        {/* Utdrag */}
        <p className="text-gray-600 mb-4">
          {excerpt}
        </p>

        {/* Les mer lenke */}
        <a 
          href="#" 
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
        >
          Les mer
          <svg 
            className="ml-2 w-4 h-4" 
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
        </a>
      </div>
    </div>
  );
};

export default BlogPostCard; 