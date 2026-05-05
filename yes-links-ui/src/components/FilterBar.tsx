'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, List, LayoutGrid, ChevronDown, Tag, Filter, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FilterBarProps {
  campaigns: string[];
  tags: string[];
  onFilterChange: (filters: { search: string; campaign: string; tags: string }) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onCreateClick?: () => void;
  showTagsFilter?: boolean;
  showCampaignFilter?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  campaigns,
  tags: availableTags,
  onFilterChange,
  viewMode = 'list',
  onViewModeChange,
  onCreateClick,
  showTagsFilter = true,
  showCampaignFilter = true,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showCampaignsDropdown, setShowCampaignsDropdown] = useState(false);

  // Debounce search
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFilterChange({
        search,
        campaign: selectedCampaign,
        tags: selectedTags.join(','),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, selectedCampaign, selectedTags, onFilterChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSearch('');
    setSelectedCampaign('');
    setSelectedTags([]);
  };

  const hasActiveFilters = search || selectedCampaign || selectedTags.length > 0;

  return (
    <div
      className="yes-link-root sticky top-0 z-30 rounded-[18px] p-4 backdrop-blur-md"
      style={{
        background: 'var(--yes-surface-glass)',
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-md)',
      }}
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        {/* Search Input */}
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--yes-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar enlaces, URLs, campañas..."
            className="w-full rounded-xl bg-[var(--yes-surface-primary)] px-4 py-2.5 pl-10 text-sm text-[var(--yes-text-primary)] outline-none transition-all focus:ring-2"
            style={{
              border: '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          />
        </div>

        {showTagsFilter && (
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => {
              setShowTagsDropdown(!showTagsDropdown);
              setShowCampaignsDropdown(false);
            }}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm tracking-tight transition-all md:w-auto",
              selectedTags.length > 0 
                ? "text-[var(--yes-accent-primary)]" 
                : "text-[var(--yes-text-primary)] hover:bg-[var(--yes-surface-tertiary)]"
            )}
            style={{
              background: 'var(--yes-surface-primary)',
              border:
                selectedTags.length > 0
                  ? '1px solid var(--yes-accent-primary)'
                  : '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
              {selectedTags.length > 0 && (
                <span
                  className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ background: 'var(--yes-accent-primary)' }}
                >
                  {selectedTags.length}
                </span>
              )}
            </div>
            <ChevronDown className={cn("h-4 w-4 text-[var(--yes-text-tertiary)] transition-transform", showTagsDropdown && "rotate-180")} />
          </button>

          {showTagsDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowTagsDropdown(false)} />
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[18px] bg-[var(--yes-surface-primary)] p-3 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                style={{
                  border: '1px solid var(--yes-border-medium)',
                  boxShadow: 'var(--yes-shadow-lg)',
                }}
              >
                <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--yes-text-tertiary)]">
                  Filtrar por Etiquetas
                </div>
                <div className="custom-scrollbar max-h-60 space-y-0.5 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span
                        className="text-sm tracking-tight text-[var(--yes-text-primary)]"
                        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                      >
                        {tag}
                      </span>
                      {selectedTags.includes(tag) && (
                        <div
                          className="flex h-4 w-4 items-center justify-center rounded-sm"
                          style={{ background: 'var(--yes-accent-primary)' }}
                        >
                          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="mt-2 w-full rounded-sm px-3 py-2 pt-3 text-xs font-bold tracking-tight transition-colors hover:bg-[var(--yes-accent-light)]"
                    style={{
                      borderTop: '1px solid var(--yes-border-subtle)',
                      color: 'var(--yes-accent-primary)',
                      letterSpacing: 'var(--letter-spacing-tight)',
                    }}
                  >
                    Limpiar Etiquetas
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        )}

        {showCampaignFilter && (
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => {
              setShowCampaignsDropdown(!showCampaignsDropdown);
              setShowTagsDropdown(false);
            }}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm tracking-tight transition-all md:w-auto",
              selectedCampaign 
                ? "text-[var(--yes-accent-primary)]" 
                : "text-[var(--yes-text-primary)] hover:bg-[var(--yes-surface-tertiary)]"
            )}
            style={{
              background: 'var(--yes-surface-primary)',
              border:
                selectedCampaign
                  ? '1px solid var(--yes-accent-primary)'
                  : '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="max-w-[120px] truncate">
                {selectedCampaign || 'Campaña'}
              </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-[var(--yes-text-tertiary)] transition-transform", showCampaignsDropdown && "rotate-180")} />
          </button>

          {showCampaignsDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCampaignsDropdown(false)} />
              <div
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-[18px] bg-[var(--yes-surface-primary)] p-3 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                style={{
                  border: '1px solid var(--yes-border-medium)',
                  boxShadow: 'var(--yes-shadow-lg)',
                }}
              >
                <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--yes-text-tertiary)]">
                  Filtrar por Campaña
                </div>
                <div className="custom-scrollbar max-h-60 space-y-0.5 overflow-y-auto">
                  {campaigns.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCampaign(selectedCampaign === c ? '' : c);
                        setShowCampaignsDropdown(false);
                      }}
                      className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span
                        className="truncate text-sm tracking-tight text-[var(--yes-text-primary)]"
                        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                      >
                        {c}
                      </span>
                      {selectedCampaign === c && (
                        <div
                          className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm"
                          style={{ background: 'var(--yes-accent-primary)' }}
                        >
                          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        )}

        {/* View Mode Toggle */}
        {onViewModeChange && (
          <div
            className="flex items-center rounded-xl p-1"
            style={{
              background: 'var(--yes-surface-primary)',
              border: '1px solid var(--yes-border-subtle)',
            }}
          >
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                "rounded-md p-2 transition-all",
                viewMode === 'list'
                  ? "text-white"
                  : "text-[var(--yes-text-secondary)] hover:text-[var(--yes-text-primary)]"
              )}
              style={{
                background: viewMode === 'list' ? 'var(--yes-accent-primary)' : 'transparent',
              }}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "rounded-md p-2 transition-all",
                viewMode === 'grid'
                  ? "text-white"
                  : "text-[var(--yes-text-secondary)] hover:text-[var(--yes-text-primary)]"
              )}
              style={{
                background: viewMode === 'grid' ? 'var(--yes-accent-primary)' : 'transparent',
              }}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-tight transition-colors hover:bg-[var(--yes-error)] hover:text-white"
            style={{
              background: 'var(--yes-error-light)',
              color: 'var(--yes-error)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}

        {onCreateClick && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{
              background: 'var(--yes-accent-primary)',
              boxShadow: 'var(--yes-shadow-sm)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <span className="text-base leading-none">+</span>
            <span>Crear</span>
          </button>
        )}
      </div>
    </div>
  );
};
