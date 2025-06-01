import type { ModalProps } from '../../types'

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
}: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-paper-white rounded-container shadow-hover border border-border-light ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden ${className}`}
      >
        {title && (
          <div className="border-b border-border-light px-6 py-4">
            <h2 className="font-serif text-xl font-semibold text-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
} 