import { useState, useMemo } from 'react';
import { Plus, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LinkCard } from '../components/link-card';
import { FilterBar } from '../components/filter-bar';
import { CreateLinkOverlay } from '../components/create-link-overlay';
import { mockLinks, allTags, allCampaigns } from '../data/mockData';

export default function ActiveLinks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCreateOverlayOpen, setIsCreateOverlayOpen] = useState(false);

  // Filter active links
  const activeLinks = mockLinks.filter((link) => !link.isArchived);

  // Apply filters
  const filteredLinks = useMemo(() => {
    return activeLinks.filter((link) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.campaign.toLowerCase().includes(searchQuery.toLowerCase());

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => link.tags.includes(tag));

      // Campaign filter
      const matchesCampaign =
        !selectedCampaign || link.campaign === selectedCampaign;

      return matchesSearch && matchesTags && matchesCampaign;
    });
  }, [activeLinks, searchQuery, selectedTags, selectedCampaign]);

  const handleCreateLink = () => {
    setIsCreateOverlayOpen(true);
  };

  // Calculate total clicks
  const totalClicks = filteredLinks.reduce((acc, link) => acc + link.clicks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-[var(--yes-radius-md)] bg-[var(--yes-surface-tertiary)]"
            style={{ border: '1px solid var(--yes-border-subtle)' }}
          >
            <Link2 className="w-5 h-5 text-[var(--yes-accent-primary)]" />
          </div>
          <div>
            <h1
              className="text-2xl font-semibold text-[var(--yes-text-primary)] mb-1"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Enlaces Activos
            </h1>
            <p
              className="text-sm text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {filteredLinks.length} enlaces • {totalClicks.toLocaleString()} clics totales
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateLink}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--yes-accent-primary)] text-[var(--yes-text-on-accent)] rounded-[var(--yes-radius-md)] hover:bg-[var(--yes-accent-hover)] transition-colors"
          style={{
            border: '1px solid var(--yes-border-subtle)',
            boxShadow: 'var(--yes-shadow-md)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Crear Enlace</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableTags={allTags}
        availableCampaigns={allCampaigns}
        onCreateClick={handleCreateLink}
      />

      {/* Results Count */}
      <div
        className="text-sm text-[var(--yes-text-secondary)]"
        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
      >
        Mostrando {filteredLinks.length} de {activeLinks.length} enlaces
      </div>

      {/* Links Grid/List */}
      {filteredLinks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)]"
          style={{
            border: '2px dashed var(--yes-border-subtle)',
          }}
        >
          <div
            className="p-4 mb-4 rounded-[var(--yes-radius-lg)] bg-[var(--yes-surface-tertiary)]"
            style={{ border: '1px solid var(--yes-border-subtle)' }}
          >
            <svg
              className="w-12 h-12 text-[var(--yes-text-tertiary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3
            className="text-lg font-semibold text-[var(--yes-text-primary)] mb-2"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            No se encontraron enlaces
          </h3>
          <p
            className="text-sm text-[var(--yes-text-secondary)]"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            Intenta ajustar los filtros o crear un nuevo enlace
          </p>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                viewMode="grid"
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                viewMode="list"
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Link Overlay */}
      <CreateLinkOverlay
        isOpen={isCreateOverlayOpen}
        onClose={() => setIsCreateOverlayOpen(false)}
      />
    </div>
  );
}