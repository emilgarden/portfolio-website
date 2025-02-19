import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  fill = false,
  width,
  height
}: OptimizedImageProps) => {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}>
      <Image
        src={src}
        alt={alt}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'}
          ${className}
        `}
        onLoadingComplete={() => setLoading(false)}
        priority={priority}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={90}
      />
    </div>
  )
}

export default OptimizedImage 