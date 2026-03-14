import { useState, forwardRef } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { LinkData } from '../data/mockData';

interface LinkCardProps {
  link: LinkData;
  viewMode?: 'grid' | 'list';
}

export const LinkCard = forwardRef<HTMLDivElement, LinkCardProps>(function LinkCard(
  { link, viewMode = 'list' },
  ref
) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sparklineChartData = link.sparklineData.map((value, index) => ({
    index,
    value,
  }));

  if (viewMode === 'grid') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)] overflow-hidden group"
        style={{
          border: '1px solid var(--yes-border-subtle)',
          boxShadow: 'var(--yes-shadow-md)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glass overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--yes-surface-glass)] backdrop-blur-sm z-10 pointer-events-none"
              style={{ border: '1px solid var(--yes-border-glow)' }}
            />
          )}
        </AnimatePresence>

        <div className="p-6 relative z-20">
          {/* Short Code with Copy */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 group/copy hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              <span className="text-lg font-semibold text-[var(--yes-text-primary)]">
                {link.shortCode}
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-[var(--yes-success)]" />
              ) : (
                <Copy className="w-4 h-4 text-[var(--yes-text-tertiary)] opacity-0 group-hover/copy:opacity-100 transition-opacity" />
              )}
            </button>
            
            <div className="text-sm text-[var(--yes-text-secondary)]">
              {link.clicks.toLocaleString()} clicks
            </div>
          </div>

          {/* Campaign Path */}
          <div className="mb-4">
            <div className="text-xs text-[var(--yes-text-tertiary)] mb-1"
                 style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
              {link.campaign}
            </div>
            <div className="text-sm text-[var(--yes-text-secondary)] truncate">
              {link.targetUrl}
            </div>
          </div>

          {/* Sparkline */}
          <div className="mb-4" style={{ width: '100%', height: '48px', marginLeft: '-8px', marginRight: '-8px' }}>
            <ResponsiveContainer width="100%" height={48}>
              <LineChart data={sparklineChartData}>
                <defs>
                  <linearGradient id={`gradient-grid-${link.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--yes-chart-primary)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--yes-chart-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--yes-chart-primary)"
                  strokeWidth={1.5}
                  fill={`url(#gradient-grid-${link.id})`}
                  dot={false}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {link.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-[var(--yes-radius-sm)] bg-[var(--yes-surface-tertiary)] text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hover Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-4 right-4 flex gap-2"
              >
                <button
                  onClick={() => window.open(link.targetUrl, '_blank')}
                  className="p-2 rounded-[var(--yes-radius-sm)] bg-[var(--yes-surface-primary)] hover:bg-[var(--yes-accent-light)] transition-colors"
                  style={{ border: '1px solid var(--yes-border-subtle)', boxShadow: 'var(--yes-shadow-sm)' }}
                >
                  <ExternalLink className="w-4 h-4 text-[var(--yes-text-secondary)]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="relative bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)] overflow-hidden group"
      style={{
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-sm)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass overlay on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--yes-surface-glass)] backdrop-blur-sm z-10 pointer-events-none"
            style={{ border: '1px solid var(--yes-border-glow)' }}
          />
        )}
      </AnimatePresence>

      <div className="px-6 py-4 flex items-center gap-6 relative z-20">
        {/* Left: Short Code */}
        <div className="flex-shrink-0 w-32">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 group/copy hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            <span className="text-base font-semibold text-[var(--yes-text-primary)]">
              {link.shortCode}
            </span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[var(--yes-success)]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[var(--yes-text-tertiary)] opacity-0 group-hover/copy:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Center: URL & Campaign */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[var(--yes-text-tertiary)] mb-1"
               style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
            {link.campaign}
          </div>
          <div className="text-sm text-[var(--yes-text-secondary)] truncate">
            {link.targetUrl}
          </div>
          <div className="flex gap-2 mt-2">
            {link.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-[var(--yes-radius-sm)] bg-[var(--yes-surface-tertiary)] text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Sparkline & Clicks */}
        <div className="flex-shrink-0 flex items-center gap-6">
          <div style={{ width: '128px', height: '48px' }}>
            <LineChart width={128} height={48} data={sparklineChartData}>
              <defs>
                <linearGradient id={`gradient-list-${link.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--yes-chart-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--yes-chart-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--yes-chart-primary)"
                strokeWidth={1.5}
                fill={`url(#gradient-list-${link.id})`}
                dot={false}
                animationDuration={500}
              />
            </LineChart>
          </div>
          
          <div className="text-right w-20">
            <div className="text-xs text-[var(--yes-text-tertiary)] mb-1">Clicks</div>
            <div className="text-base font-semibold text-[var(--yes-text-primary)]"
                 style={{ fontFamily: 'var(--font-mono)' }}>
              {link.clicks.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-shrink-0 flex gap-2"
            >
              <button
                onClick={() => window.open(link.targetUrl, '_blank')}
                className="p-2 rounded-[var(--yes-radius-sm)] bg-[var(--yes-surface-primary)] hover:bg-[var(--yes-accent-light)] transition-colors"
                style={{ border: '1px solid var(--yes-border-subtle)', boxShadow: 'var(--yes-shadow-sm)' }}
              >
                <ExternalLink className="w-4 h-4 text-[var(--yes-text-secondary)]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});