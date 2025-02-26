interface SectionHeadingProps {
  title: string
  subtitle?: string
  alignment?: 'left' | 'center' | 'right'
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  alignment = 'left' 
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return (
    <div className={`mb-12 ${alignmentClasses[alignment]}`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
    </div>
  )
} 