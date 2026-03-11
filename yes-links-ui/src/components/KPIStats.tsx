import React from 'react'
import { Link, MousePointer2, Trophy, AlertCircle } from 'lucide-react'
import { i18n } from '@/lib/i18n'

type State = 'idle' | 'loading' | 'success' | 'error'

interface KPIStatsProps {
  state: State
  data: {
    total_clicks: number
    total_links: number
    top_campaign?: string
  } | null
  error?: string
}

export const KPIStats: React.FC<KPIStatsProps> = ({ state, data, error }) => {
  const t = i18n.analytics

  if (state === 'loading') {
    return (
      <div className="yes-link-grid yes-link-grid-cols-1 yes-link-gap-4 md:yes-link-grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            data-testid="kpi-skeleton"
            className="yes-link-h-24 yes-link-animate-pulse yes-link-rounded-xl yes-link-bg-muted" 
          />
        ))}
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="yes-link-flex yes-link-items-center yes-link-space-x-3 yes-link-rounded-xl yes-link-border yes-link-border-destructive/20 yes-link-bg-destructive/5 yes-link-p-6">
        <AlertCircle className="yes-link-h-5 yes-link-w-5 yes-link-text-destructive" />
        <p className="yes-link-text-sm yes-link-font-medium yes-link-text-destructive">{error || t.failed}</p>
      </div>
    )
  }

  const stats = [
    { 
      label: t.totalLinks, 
      value: data?.total_links.toLocaleString() || '0', 
      icon: Link,
      color: 'yes-link-text-primary'
    },
    { 
      label: t.totalClicks, 
      value: data?.total_clicks.toLocaleString() || '0', 
      icon: MousePointer2,
      color: 'yes-link-text-primary'
    },
    { 
      label: t.topCampaign, 
      value: data?.top_campaign || 'N/A', 
      icon: Trophy,
      color: 'yes-link-text-accent-foreground'
    }
  ]

  return (
    <div className="yes-link-grid yes-link-grid-cols-1 yes-link-gap-4 md:yes-link-grid-cols-3">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="yes-link-flex yes-link-flex-col yes-link-justify-between yes-link-rounded-xl yes-link-border yes-link-border-muted yes-link-bg-background yes-link-p-6 yes-link-shadow-sm"
        >
          <div className="yes-link-flex yes-link-items-center yes-link-justify-between">
            <span className="yes-link-text-xs yes-link-font-medium yes-link-uppercase yes-link-tracking-wider yes-link-text-muted-foreground">
              {stat.label}
            </span>
            <stat.icon className="yes-link-h-4 yes-link-w-4 yes-link-text-muted-foreground" />
          </div>
          <div className="yes-link-mt-2">
            <span className={`yes-link-text-2xl yes-link-font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
