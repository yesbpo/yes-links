import { TrendingUp, Link2, MousePointerClick, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AnalyticsData } from '../data/mockData';

interface AnalyticsWidgetsProps {
  data: AnalyticsData;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
}

function KPICard({ title, value, subtitle, icon, trend }: KPICardProps) {
  return (
    <div
      className="p-6 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)]"
      style={{
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-md)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-[var(--yes-radius-md)] bg-[var(--yes-accent-light)]"
            style={{ border: '1px solid var(--yes-border-subtle)' }}
          >
            {icon}
          </div>
          <div>
            <div className="text-xs text-[var(--yes-text-tertiary)] mb-1"
                 style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
              {title}
            </div>
            <div className="text-2xl font-semibold text-[var(--yes-text-primary)]"
                 style={{ fontFamily: 'var(--font-mono)', letterSpacing: 'var(--letter-spacing-tight)' }}>
              {value}
            </div>
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-[var(--yes-radius-sm)] bg-[var(--yes-success-light)]">
            <TrendingUp className="w-3 h-3 text-[var(--yes-success)]" />
            <span className="text-xs font-semibold text-[var(--yes-success)]">
              +{trend}%
            </span>
          </div>
        )}
      </div>
      
      <div className="text-xs text-[var(--yes-text-secondary)]"
           style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
        {subtitle}
      </div>
    </div>
  );
}

export function AnalyticsWidgets({ data }: AnalyticsWidgetsProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-3 py-2 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-md)]"
          style={{
            border: '1px solid var(--yes-border-medium)',
            boxShadow: 'var(--yes-shadow-lg)',
          }}
        >
          <div className="text-xs text-[var(--yes-text-tertiary)] mb-1">
            {payload[0].payload.date}
          </div>
          {payload.map((entry: any) => (
            <div key={`${entry.dataKey}-${entry.value}`} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-[var(--yes-text-primary)] font-semibold">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TOTAL CLICKS"
          value={data.totalClicks.toLocaleString()}
          subtitle="Last 30 days"
          icon={<MousePointerClick className="w-5 h-5 text-[var(--yes-accent-primary)]" />}
          trend={12.5}
        />
        
        <KPICard
          title="TOTAL LINKS"
          value={data.totalLinks}
          subtitle="All time"
          icon={<Link2 className="w-5 h-5 text-[var(--yes-accent-primary)]" />}
        />
        
        <KPICard
          title="ACTIVE LINKS"
          value={data.activeLinks}
          subtitle="Currently active"
          icon={<Target className="w-5 h-5 text-[var(--yes-accent-primary)]" />}
        />
        
        <KPICard
          title="CTR"
          value={`${data.clickThroughRate}%`}
          subtitle="Average rate"
          icon={<TrendingUp className="w-5 h-5 text-[var(--yes-accent-primary)]" />}
          trend={3.2}
        />
      </div>

      {/* Trend Chart */}
      <div
        className="p-6 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)]"
        style={{
          border: '1px solid var(--yes-border-subtle)',
          boxShadow: 'var(--yes-shadow-md)',
        }}
      >
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[var(--yes-text-primary)] mb-1"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
            Performance Trends
          </h3>
          <p className="text-xs text-[var(--yes-text-tertiary)]"
             style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
            Clicks and conversions over the last 30 days
          </p>
        </div>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.trendData}>
              <defs>
                <linearGradient id="analytics-clicks-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--yes-accent-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--yes-accent-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="analytics-conversions-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--yes-border-subtle)"
                vertical={false}
              />
              
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="var(--yes-text-tertiary)"
                tick={{ fill: 'var(--yes-text-tertiary)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--yes-border-subtle)' }}
              />
              
              <YAxis
                stroke="var(--yes-text-tertiary)"
                tick={{ fill: 'var(--yes-text-tertiary)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--yes-border-subtle)' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="var(--yes-accent-primary)"
                strokeWidth={1.5}
                fill="url(#analytics-clicks-gradient)"
                name="Clicks"
                animationDuration={500}
              />
              
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#22c55e"
                strokeWidth={1.5}
                fill="url(#analytics-conversions-gradient)"
                name="Conversions"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--yes-accent-primary)]" />
            <span className="text-xs text-[var(--yes-text-secondary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
              Clicks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span className="text-xs text-[var(--yes-text-secondary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
              Conversions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}