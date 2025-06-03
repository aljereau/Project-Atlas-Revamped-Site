interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'interactive font-medium rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bright-orange focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-atlas-green text-paper-white hover:bg-atlas-green-dark',
    secondary: 'bg-bright-orange text-paper-white hover:bg-bright-orange-hover',
    outline: 'border-2 border-atlas-green text-atlas-green hover:bg-atlas-green hover:text-paper-white',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:transform-none' 
    : 'cursor-pointer'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
} 