import React from 'react'
import { AlertCircle, RefreshCw, PlusCircle, ExternalLink, Pencil, Trash2 } from 'lucide-react'

type State = 'idle' | 'loading' | 'success' | 'empty' | 'error'

interface Link {
  id: string
  short_code: string
  target_url: string
  campaign?: string
}

interface LinkListProps {
  state: State
  links: Link[]
  error?: string
  onRetry?: () => void
  onCreateFirst?: () => void
  onEdit?: (link: Link) => void
  onDelete?: (id: string) => void
}

export const LinkList: React.FC<LinkListProps> = ({ 
  state, 
  links, 
  error, 
  onRetry,
  onCreateFirst,
  onEdit,
  onDelete
}) => {
  // 1. Loading State (Skeletons)
  if (state === 'loading') {
    return (
      <div data-testid="link-list-loading" className="yes-link-space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="yes-link-h-16 yes-link-w-full yes-link-animate-pulse yes-link-rounded-lg yes-link-bg-muted" />
        ))}
      </div>
    )
  }

  // 2. Error State
  if (state === 'error') {
    return (
      <div className="yes-link-flex yes-link-flex-col yes-link-items-center yes-link-justify-center yes-link-space-y-4 yes-link-rounded-lg yes-link-border yes-link-border-destructive/20 yes-link-bg-destructive/5 yes-link-p-8 yes-link-text-center">
        <AlertCircle className="yes-link-h-10 yes-link-w-10 yes-link-text-destructive" />
        <div>
          <h3 className="yes-link-text-lg yes-link-font-semibold yes-link-text-foreground">Failed to fetch links</h3>
          <p className="yes-link-text-sm yes-link-text-muted-foreground">{error || 'An unexpected error occurred'}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="yes-link-flex yes-link-items-center yes-link-space-x-2 yes-link-rounded-md yes-link-bg-destructive yes-link-px-4 yes-link-py-2 yes-link-text-sm yes-link-font-medium yes-link-text-destructive-foreground hover:yes-link-bg-destructive/90"
          >
            <RefreshCw className="yes-link-h-4 yes-link-w-4" />
            <span>Retry</span>
          </button>
        )}
      </div>
    )
  }

  // 3. Empty State
  if (state === 'empty' || (state === 'success' && links.length === 0)) {
    return (
      <div className="yes-link-flex yes-link-flex-col yes-link-items-center yes-link-justify-center yes-link-space-y-4 yes-link-rounded-lg yes-link-border yes-link-border-dashed yes-link-border-muted-foreground/20 yes-link-p-12 yes-link-text-center">
        <PlusCircle className="yes-link-h-12 yes-link-w-12 yes-link-text-muted-foreground" />
        <div>
          <h3 className="yes-link-text-xl yes-link-font-bold yes-link-text-foreground">No links found</h3>
          <p className="yes-link-text-sm yes-link-text-muted-foreground">Start by creating your first short link for your campaign.</p>
        </div>
        {onCreateFirst && (
          <button
            onClick={onCreateFirst}
            className="yes-link-rounded-md yes-link-bg-primary yes-link-px-6 yes-link-py-2 yes-link-text-sm yes-link-font-semibold yes-link-text-primary-foreground hover:yes-link-bg-primary/90"
          >
            Create your first link
          </button>
        )}
      </div>
    )
  }

  // 4. Success State (The List)
  return (
    <div className="yes-link-space-y-3">
      {links.map((link) => (
        <div 
          key={link.id} 
          className="yes-link-group yes-link-flex yes-link-items-center yes-link-justify-between yes-link-rounded-lg yes-link-border yes-link-border-muted yes-link-bg-background yes-link-p-4 yes-link-transition-all hover:yes-link-border-primary/30 hover:yes-link-shadow-sm"
        >
          <div className="yes-link-flex yes-link-flex-col yes-link-space-y-1">
            <span className="yes-link-font-mono yes-link-text-lg yes-link-font-bold yes-link-text-primary">{link.short_code}</span>
            <span className="yes-link-max-w-xs yes-link-truncate yes-link-text-xs yes-link-text-muted-foreground md:yes-link-max-w-md">
              {link.target_url}
            </span>
          </div>
          <div className="yes-link-flex yes-link-items-center yes-link-space-x-1">
            {link.campaign && (
              <span className="yes-link-mr-2 yes-link-rounded-full yes-link-bg-accent yes-link-px-2 yes-link-py-0.5 yes-link-text-[10px] yes-link-font-medium yes-link-text-accent-foreground">
                {link.campaign}
              </span>
            )}
            
            {onEdit && (
              <button
                aria-label="Edit"
                onClick={() => onEdit(link)}
                className="yes-link-rounded-md yes-link-p-2 yes-link-text-muted-foreground hover:yes-link-bg-info/10 hover:yes-link-text-info"
              >
                <Pencil className="yes-link-h-4 yes-link-w-4" />
              </button>
            )}

            {onDelete && (
              <button
                aria-label="Delete"
                onClick={() => onDelete(link.id)}
                className="yes-link-rounded-md yes-link-p-2 yes-link-text-muted-foreground hover:yes-link-bg-destructive/10 hover:yes-link-text-destructive"
              >
                <Trash2 className="yes-link-h-4 yes-link-w-4" />
              </button>
            )}

            <a 
              href={link.target_url} 
              target="_blank" 
              rel="noreferrer"
              className="yes-link-rounded-md yes-link-p-2 yes-link-text-muted-foreground hover:yes-link-bg-accent hover:yes-link-text-accent-foreground"
            >
              <ExternalLink className="yes-link-h-4 yes-link-w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
