import React from 'react'

interface CorporateContainerProps {
  children: React.ReactNode
  variant?: 'full' | 'compact'
  className?: string
}

export const CorporateContainer: React.FC<CorporateContainerProps> = ({ 
  children, 
  variant = 'full',
  className = '' 
}) => {
  const paddingClass = variant === 'full' ? 'p-8' : 'p-4'
  
  return (
    <div className={`
      mx-auto 
      w-full 
      max-w-6xl 
      bg-background 
      rounded-xl 
      border 
      border-muted 
      shadow-sm 
      ${paddingClass} 
      ${className}
    `}>
      {children}
    </div>
  )
}
