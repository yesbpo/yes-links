'use client';

import React from 'react';
import { AlertCircle, Link2, MousePointerClick, Target, TrendingUp } from 'lucide-react';
import { i18n } from '@/lib/i18n';

type State = 'idle' | 'loading' | 'success' | 'error';

export interface KPIStatsData {
  total_clicks: number;
  total_links: number;
  active_links: number;
  ctr: number;
  trends?: {
    clicks?: number;
    ctr?: number;
  };
}

export interface KPIStatsProps {
  state: State;
  data: KPIStatsData | null;
  error?: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
}

function KPICard({ title, value, subtitle, icon, trend }: KPICardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div
      className="yes-link-root rounded-[18px] px-4 py-3.5"
      style={{
        background: 'var(--yes-surface-primary)',
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-sm)',
      }}
    >
      <div className="mb-3.5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{
              background: 'var(--yes-accent-light)',
              border: '1px solid color-mix(in srgb, var(--yes-accent-primary) 8%, white)',
            }}
          >
            {icon}
          </div>
          <div>
            <div
              className="mb-1 text-[9px] font-medium uppercase text-[var(--yes-text-tertiary)]"
              style={{ letterSpacing: '0.08em' }}
            >
              {title}
            </div>
            <div
              className="text-[17px] font-semibold text-[var(--yes-text-primary)]"
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              {value}
            </div>
          </div>
        </div>

        {trend !== undefined && (
          <div
            className="flex items-center gap-1 rounded-md px-2 py-0.5"
            style={{
              background: isPositive ? 'var(--yes-success-light)' : 'var(--yes-error-light)',
            }}
          >
            <TrendingUp
              className="h-3 w-3"
              style={{
                color: isPositive ? 'var(--yes-success)' : 'var(--yes-error)',
                transform: isPositive ? undefined : 'rotate(180deg)',
              }}
            />
            <span
              className="text-[9px] font-semibold"
              style={{
                color: isPositive ? 'var(--yes-success)' : 'var(--yes-error)',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              {trend >= 0 ? '+' : ''}
              {trend}%
            </span>
          </div>
        )}
      </div>

      <div
        className="text-[10px] text-[var(--yes-text-secondary)]"
        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
      >
        {subtitle}
      </div>
    </div>
  );
}

export const KPIStats: React.FC<KPIStatsProps> = ({ state, data, error }) => {
  const t = i18n.analytics;

  if (state === 'loading') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            data-testid="kpi-skeleton"
            className="h-[112px] animate-pulse rounded-[18px]"
            style={{
              background: 'var(--yes-surface-primary)',
              border: '1px solid var(--yes-border-subtle)',
            }}
          />
        ))}
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div
        className="yes-link-root flex items-center gap-3 rounded-[18px] p-6"
        style={{
          background: 'var(--yes-error-light)',
          border: '1px solid color-mix(in srgb, var(--yes-error) 18%, white)',
        }}
      >
        <AlertCircle className="h-5 w-5 text-[var(--yes-error)]" />
        <p className="text-sm font-medium text-[var(--yes-error)]">{error || t.failed}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="TOTAL CLICKS"
        value={data?.total_clicks.toLocaleString() || '0'}
        subtitle="Last 30 days"
        icon={<MousePointerClick className="h-5 w-5 text-[var(--yes-accent-primary)]" />}
        trend={data?.trends?.clicks}
      />
      <KPICard
        title="TOTAL LINKS"
        value={data?.total_links.toLocaleString() || '0'}
        subtitle="All time"
        icon={<Link2 className="h-5 w-5 text-[var(--yes-accent-primary)]" />}
      />
      <KPICard
        title="ACTIVE LINKS"
        value={data?.active_links.toLocaleString() || '0'}
        subtitle="Currently active"
        icon={<Target className="h-5 w-5 text-[var(--yes-accent-primary)]" />}
      />
      <KPICard
        title="CTR"
        value={`${data?.ctr || 0}%`}
        subtitle="Average rate"
        icon={<TrendingUp className="h-5 w-5 text-[var(--yes-accent-primary)]" />}
        trend={data?.trends?.ctr}
      />
    </div>
  );
};
