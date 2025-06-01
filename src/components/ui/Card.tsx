interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export default function Card({
  children,
  title,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const baseClasses = 'bg-paper-white rounded-card p-6 shadow-subtle border border-border-light'
  const hoverClasses = hoverable || onClick 
    ? 'interactive hover:shadow-hover cursor-pointer' 
    : ''
  
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {title && (
        <h3 className="font-serif text-lg font-semibold text-text-primary mb-3">
          {title}
        </h3>
      )}
      <div className="text-text-secondary">
        {children}
      </div>
    </div>
  )
} 