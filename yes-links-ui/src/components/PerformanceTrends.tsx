'use client';

import React from 'react';

export interface TrendData {
  date: string;
  clicks: number;
  conversions: number;
}

export interface PerformanceTrendsProps {
  state: 'idle' | 'loading' | 'success' | 'error';
  data: TrendData[];
}

function createSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return '';

  let path = `M ${points[0].x},${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;

    path += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }

  return path;
}

export const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ state, data }) => {
  const width = 920;
  const height = 320;
  const padding = { top: 18, right: 18, bottom: 34, left: 42 };

  if (state === 'loading') {
    return (
      <div
        data-testid="trends-loading"
        className="yes-link-root rounded-[18px] p-6"
        style={{
          background: 'var(--yes-surface-primary)',
          border: '1px solid var(--yes-border-subtle)',
          boxShadow: 'var(--yes-shadow-md)',
        }}
      >
        <div className="mb-2 h-8 w-48 animate-pulse rounded bg-[var(--yes-surface-tertiary)]" />
        <div className="mb-8 h-4 w-64 animate-pulse rounded bg-[var(--yes-surface-tertiary)]" />
        <div className="h-[240px] w-full animate-pulse rounded-[14px] bg-[var(--yes-surface-tertiary)]" />
      </div>
    );
  }

  const renderChart = () => {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map((item) => Math.max(item.clicks, item.conversions)), 10);
    const roundedMax = Math.ceil(maxVal / 20) * 20;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const getX = (index: number) => padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - (value / roundedMax) * chartHeight;

    const clickPoints = data.map((item, index) => ({ x: getX(index), y: getY(item.clicks) }));
    const conversionPoints = data.map((item, index) => ({ x: getX(index), y: getY(item.conversions) }));
    const clickLinePath = createSmoothPath(clickPoints);
    const conversionLinePath = createSmoothPath(conversionPoints);
    const clickArea = `${clickLinePath} L ${clickPoints[clickPoints.length - 1].x},${padding.top + chartHeight} L ${clickPoints[0].x},${padding.top + chartHeight} Z`;
    const conversionArea = `${conversionLinePath} L ${conversionPoints[conversionPoints.length - 1].x},${padding.top + chartHeight} L ${conversionPoints[0].x},${padding.top + chartHeight} Z`;

    const tickValues = Array.from({ length: 5 }, (_, index) => Math.round((roundedMax / 4) * (4 - index)));

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="clicks-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--yes-chart-primary)" stopOpacity={0.018} />
            <stop offset="100%" stopColor="var(--yes-chart-primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conversions-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#88c57d" stopOpacity={0.13} />
            <stop offset="100%" stopColor="var(--yes-success)" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {tickValues.map((value) => {
          const y = getY(value);
          return (
            <g key={value}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="var(--yes-border-subtle)"
                strokeDasharray="3 5"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-[var(--yes-text-tertiary)] text-[10px]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                {value}
              </text>
            </g>
          );
        })}

        <path d={clickArea} fill="url(#clicks-grad)" />
        <path d={conversionArea} fill="url(#conversions-grad)" />

        <path
          d={clickLinePath}
          fill="none"
          stroke="var(--yes-chart-primary)"
          strokeOpacity="0.28"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={conversionLinePath}
          fill="none"
          stroke="#88c57d"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => {
          if (index % Math.ceil(data.length / 8) !== 0 && index !== data.length - 1) return null;
          const x = getX(index);
          const date = new Date(item.date);
          const label = `${date.getMonth() + 1}/${date.getDate()}`;
          return (
            <text
              key={item.date}
              x={x}
              y={height - 12}
              textAnchor="middle"
              className="fill-[var(--yes-text-tertiary)] text-[10px]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {label}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div
      className="yes-link-root rounded-[18px] p-6"
      style={{
        background: 'var(--yes-surface-primary)',
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-md)',
      }}
    >
      <div className="mb-6">
        <h3
          className="mb-1 text-base font-semibold text-[var(--yes-text-primary)]"
          style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
        >
          Performance Trends
        </h3>
        <p
          className="text-xs text-[var(--yes-text-tertiary)]"
          style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
        >
          Clicks and conversions over the last 30 days
        </p>
      </div>

      <div className="mb-4 h-[320px] w-full">{renderChart()}</div>

      <div className="flex items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[var(--yes-chart-primary)]" />
          <span
            className="text-[11px] text-[var(--yes-text-secondary)]"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            Clicks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[var(--yes-success)]" />
          <span
            className="text-[11px] text-[var(--yes-text-secondary)]"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            Conversions
          </span>
        </div>
      </div>
    </div>
  );
};
