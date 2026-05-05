'use client';

import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Pencil } from 'lucide-react';
import { logger } from '@/lib/logger';

export interface Link {
  id: string;
  short_code: string;
  target_url: string;
  campaign?: string;
  tags?: string[];
  clicks?: number;
  sparkline_data?: number[];
}

interface LinkCardProps {
  link: Link;
  viewMode?: 'grid' | 'list';
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
}

export function LinkCard({
  link,
  viewMode = 'list',
  onEdit,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(link.short_code);
    setCopied(true);
    logger.info({ event: 'link_copy_clicked', short_code: link.short_code }, 'Short code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSparkline = (data: number[] = [], width: number, height: number) => {
    if (data.length === 0) return null;

    const padding = 4;
    const maxVal = Math.max(...data, 1);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    const points = data.map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - minVal) / range) * (height - padding * 2);
      return { x, y };
    });

    const pointsString = points.map((point) => `${point.x},${point.y}`).join(' ');

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`sparkline-${link.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--yes-chart-primary)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--yes-chart-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d={`M ${points[0].x},${height} L ${pointsString} L ${points[points.length - 1].x},${height} Z`}
          fill={`url(#sparkline-${link.id})`}
        />
        <polyline
          fill="none"
          stroke="var(--yes-chart-primary)"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsString}
        />
      </svg>
    );
  };

  if (viewMode === 'grid') {
    return (
      <div
        className="yes-link-root group relative flex h-full flex-col rounded-[20px] p-6 transition-all duration-200"
        style={{
          background: 'var(--yes-surface-primary)',
          border: '1px solid var(--yes-border-subtle)',
          boxShadow: 'var(--yes-shadow-md)',
        }}
      >
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={() => onEdit(link)}
              className="rounded-lg p-2 transition-colors hover:bg-[var(--yes-accent-light)]"
              style={{
                background: 'var(--yes-surface-primary)',
                border: '1px solid var(--yes-border-subtle)',
                boxShadow: 'var(--yes-shadow-sm)',
              }}
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4 text-[var(--yes-text-secondary)]" />
            </button>
          )}
          <button
            onClick={() => window.open(link.target_url, '_blank')}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--yes-accent-light)]"
            style={{
              background: 'var(--yes-surface-primary)',
              border: '1px solid var(--yes-border-subtle)',
              boxShadow: 'var(--yes-shadow-sm)',
            }}
            aria-label="Open"
          >
            <ExternalLink className="h-4 w-4 text-[var(--yes-text-secondary)]" />
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={handleCopy}
            className="group/copy flex items-center gap-2"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span
              className="text-lg font-semibold text-[var(--yes-text-primary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {link.short_code}
            </span>
            {copied ? (
              <Check className="h-4 w-4 text-[var(--yes-success)]" />
            ) : (
              <Copy className="h-3.5 w-3.5 opacity-0 text-[var(--yes-text-tertiary)] transition-opacity group-hover/copy:opacity-100" />
            )}
          </button>
          <div
            className="mt-1 text-[11px] uppercase text-[var(--yes-text-tertiary)]"
            style={{ letterSpacing: '0.06em' }}
          >
            {link.campaign || 'General'}
          </div>
        </div>

        <div className="mb-4 flex min-h-[48px] flex-1 items-end">
          {renderSparkline(link.sparkline_data, 220, 48)}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="text-sm text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {link.clicks?.toLocaleString() || 0} clicks
            </span>
            <div className="flex gap-2">
              {link.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-1 text-[11px] text-[var(--yes-text-secondary)]"
                  style={{
                    background: 'var(--yes-surface-tertiary)',
                    letterSpacing: 'var(--letter-spacing-tight)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            className="truncate border-t pt-3 text-sm text-[var(--yes-text-secondary)]"
            style={{
              borderColor: 'var(--yes-border-subtle)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            {link.target_url}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="yes-link-root group relative flex items-center gap-4 rounded-[18px] px-4 py-[13px] transition-all duration-200"
      style={{
        background: 'var(--yes-surface-primary)',
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-sm)',
      }}
    >
      <div className="w-[118px] flex-shrink-0">
        <button
          onClick={handleCopy}
          className="group/copy flex items-center gap-2"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span
            className="text-[13px] font-semibold text-[var(--yes-text-primary)]"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            {link.short_code}
          </span>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[var(--yes-success)]" />
          ) : (
            <Copy className="h-3 w-3 opacity-0 text-[var(--yes-text-tertiary)] transition-opacity group-hover/copy:opacity-100" />
          )}
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <span
            className="text-[9px] font-semibold uppercase text-[var(--yes-text-tertiary)]"
            style={{ letterSpacing: '0.08em' }}
          >
            {link.campaign || 'General'}
          </span>
          <div className="flex flex-wrap gap-1">
            {link.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md px-1.5 py-0.5 text-[8px] text-[var(--yes-text-secondary)]"
                style={{
                  background: 'var(--yes-surface-tertiary)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div
          className="truncate text-[12px] text-[var(--yes-text-secondary)]"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}
        >
          {link.target_url}
        </div>
      </div>

      <div className="flex w-[136px] flex-shrink-0 items-center justify-center">
        {renderSparkline(link.sparkline_data, 118, 34)}
      </div>

      <div className="w-[70px] flex-shrink-0 text-right">
        <div
          className="text-[9px] font-semibold uppercase text-[var(--yes-text-tertiary)]"
          style={{ letterSpacing: '0.08em' }}
        >
          Clicks
        </div>
        <div
          className="text-[12px] font-semibold text-[var(--yes-text-primary)]"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}
        >
          {link.clicks?.toLocaleString() || 0}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            onClick={() => onEdit(link)}
            className="rounded-md p-1.5 transition-colors hover:bg-[var(--yes-surface-tertiary)]"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4 text-[var(--yes-text-secondary)]" />
          </button>
        )}
        <button
          onClick={() => window.open(link.target_url, '_blank')}
          className="rounded-md p-1.5 transition-colors hover:bg-[var(--yes-surface-tertiary)]"
          aria-label="Open"
        >
          <ExternalLink className="h-3.5 w-3.5 text-[var(--yes-text-secondary)]" />
        </button>
      </div>
    </div>
  );
}
