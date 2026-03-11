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
  const paddingClass = variant === 'full' ? 'yes-link-p-8' : 'yes-link-p-4'
  
  return (
    <div className={`
      yes-link-mx-auto 
      yes-link-w-full 
      yes-link-max-w-6xl 
      yes-link-bg-background 
      yes-link-rounded-xl 
      yes-link-border 
      yes-link-border-muted 
      yes-link-shadow-sm 
      ${paddingClass} 
      ${className}
    `}>
      {children}
    </div>
  )
}
