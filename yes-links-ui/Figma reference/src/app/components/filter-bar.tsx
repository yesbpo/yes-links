import { Search, Grid3x3, List, ChevronDown, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedCampaign: string | null;
  onCampaignChange: (campaign: string | null) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  availableTags: string[];
  availableCampaigns: string[];
  onCreateClick: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  selectedCampaign,
  onCampaignChange,
  viewMode,
  onViewModeChange,
  availableTags,
  availableCampaigns,
  onCreateClick,
}: FilterBarProps) {
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showCampaignsDropdown, setShowCampaignsDropdown] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div
      className="sticky top-0 z-30 bg-[var(--yes-surface-glass)] backdrop-blur-md rounded-[var(--yes-radius-lg)] p-4"
      style={{
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-md)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--yes-text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar enlaces, URLs, campañas..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] placeholder:text-[var(--yes-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--yes-accent-primary)] transition-shadow"
            style={{
              border: '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          />
        </div>

        {/* Tags Filter Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTagsDropdown(!showTagsDropdown);
              setShowCampaignsDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] hover:bg-[var(--yes-surface-tertiary)] transition-colors"
            style={{
              border: selectedTags.length > 0 ? '1px solid var(--yes-accent-primary)' : '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <span>Tags</span>
            {selectedTags.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--yes-accent-primary)] text-white text-xs font-semibold">
                {selectedTags.length}
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-[var(--yes-text-tertiary)]" />
          </button>

          <AnimatePresence>
            {showTagsDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTagsDropdown(false)}
                />
                
                {/* Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 w-64 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)] p-3 z-50"
                  style={{
                    border: '1px solid var(--yes-border-medium)',
                    boxShadow: 'var(--yes-shadow-lg)',
                  }}
                >
                  <div className="text-xs font-semibold text-[var(--yes-text-tertiary)] mb-2 px-2"
                       style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
                    FILTRAR POR ETIQUETAS
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--yes-radius-sm)] hover:bg-[var(--yes-surface-tertiary)] transition-colors text-left"
                      >
                        <span className="text-sm text-[var(--yes-text-primary)]"
                              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
                          {tag}
                        </span>
                        {selectedTags.includes(tag) && (
                          <div className="w-4 h-4 rounded bg-[var(--yes-accent-primary)] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => onTagsChange([])}
                      className="w-full mt-2 px-3 py-2 text-xs text-[var(--yes-accent-primary)] hover:bg-[var(--yes-accent-light)] rounded-[var(--yes-radius-sm)] transition-colors font-semibold"
                      style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      Limpiar Todo
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Campaign Filter Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCampaignsDropdown(!showCampaignsDropdown);
              setShowTagsDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] hover:bg-[var(--yes-surface-tertiary)] transition-colors"
            style={{
              border: selectedCampaign ? '1px solid var(--yes-accent-primary)' : '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <span>Campaña</span>
            <ChevronDown className="w-4 h-4 text-[var(--yes-text-tertiary)]" />
          </button>

          <AnimatePresence>
            {showCampaignsDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCampaignsDropdown(false)}
                />
                
                {/* Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 w-80 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)] p-3 z-50"
                  style={{
                    border: '1px solid var(--yes-border-medium)',
                    boxShadow: 'var(--yes-shadow-lg)',
                  }}
                >
                  <div className="text-xs font-semibold text-[var(--yes-text-tertiary)] mb-2 px-2"
                       style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
                    FILTRAR POR CAMPAÑA
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {availableCampaigns.map((campaign) => (
                      <button
                        key={campaign}
                        onClick={() => {
                          onCampaignChange(selectedCampaign === campaign ? null : campaign);
                          setShowCampaignsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--yes-radius-sm)] hover:bg-[var(--yes-surface-tertiary)] transition-colors text-left"
                      >
                        <span className="text-sm text-[var(--yes-text-primary)] truncate"
                              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>
                          {campaign}
                        </span>
                        {selectedCampaign === campaign && (
                          <div className="w-4 h-4 rounded bg-[var(--yes-accent-primary)] flex items-center justify-center flex-shrink-0 ml-2">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedCampaign && (
                    <button
                      onClick={() => onCampaignChange(null)}
                      className="w-full mt-2 px-3 py-2 text-xs text-[var(--yes-accent-primary)] hover:bg-[var(--yes-accent-light)] rounded-[var(--yes-radius-sm)] transition-colors font-semibold"
                      style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      Limpiar
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Switcher */}
        <div
          className="flex items-center bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-md)] p-1"
          style={{ border: '1px solid var(--yes-border-subtle)' }}
        >
          <button
            onClick={() => onViewModeChange('list')}
            className="relative p-2 rounded-[var(--yes-radius-sm)] transition-colors"
            style={{
              backgroundColor: viewMode === 'list' ? 'var(--yes-accent-primary)' : 'transparent',
            }}
          >
            <List
              className="w-4 h-4"
              style={{
                color: viewMode === 'list' ? 'var(--yes-text-on-accent)' : 'var(--yes-text-secondary)',
              }}
            />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className="relative p-2 rounded-[var(--yes-radius-sm)] transition-colors"
            style={{
              backgroundColor: viewMode === 'grid' ? 'var(--yes-accent-primary)' : 'transparent',
            }}
          >
            <Grid3x3
              className="w-4 h-4"
              style={{
                color: viewMode === 'grid' ? 'var(--yes-text-on-accent)' : 'var(--yes-text-secondary)',
              }}
            />
          </button>
        </div>

        {/* Active Filters Count */}
        {(selectedTags.length > 0 || selectedCampaign || searchQuery) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              onSearchChange('');
              onTagsChange([]);
              onCampaignChange(null);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--yes-error-light)] text-[var(--yes-error)] rounded-[var(--yes-radius-md)] text-sm hover:bg-[var(--yes-error)] hover:text-white transition-colors"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            <X className="w-4 h-4" />
            <span>Limpiar Todo</span>
          </motion.button>
        )}

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--yes-accent-primary)] text-white rounded-[var(--yes-radius-md)] text-sm font-semibold hover:bg-[var(--yes-accent-hover)] transition-colors"
          style={{ 
            letterSpacing: 'var(--letter-spacing-tight)',
            boxShadow: 'var(--yes-shadow-sm)'
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Crear</span>
        </button>
      </div>
    </div>
  );
}