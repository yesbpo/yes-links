import React from 'react'
import { AlertCircle, RefreshCw, PlusCircle } from 'lucide-react'
import { i18n } from '@/lib/i18n'
import { LinkCard, Link } from './LinkCard'

type State = 'idle' | 'loading' | 'success' | 'empty' | 'error'

interface LinkListProps {
  state: State
  links: Link[]
  viewMode?: 'grid' | 'list'
  error?: string
  onRetry?: () => void
  onCreateFirst?: () => void
  onEdit?: (link: Link) => void
  onDelete?: (id: string) => void
}

export const LinkList: React.FC<LinkListProps> = ({ 
  state, 
  links, 
  viewMode = 'list',
  error, 
  onRetry,
  onCreateFirst,
  onEdit,
  onDelete
}) => {
  const t = i18n.links.list

  if (state === 'loading') {
    return (
      <div data-testid="link-list-loading" className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t.errorTitle}</h3>
          <p className="text-sm text-muted-foreground">{error || t.errorSubtitle}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t.retry}</span>
          </button>
        )}
      </div>
    )
  }

  if (state === 'empty' || (state === 'success' && links.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-muted-foreground/20 p-12 text-center">
        <PlusCircle className="h-12 w-12 text-muted-foreground" />
        <div>
          <h3 className="text-xl font-bold text-foreground">{t.emptyTitle}</h3>
          <p className="text-sm text-muted-foreground">{t.emptySubtitle}</p>
        </div>
        {onCreateFirst && (
          <button
            onClick={onCreateFirst}
            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.createFirst}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
      {links.map((link) => (
        <LinkCard 
          key={link.id} 
          link={link} 
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
