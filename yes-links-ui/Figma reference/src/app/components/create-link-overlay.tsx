import { useState } from 'react';
import { X, Link2, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface CreateLinkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLinkOverlay({ isOpen, onClose }: CreateLinkOverlayProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [campaign, setCampaign] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de creación de enlace
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success('Enlace creado exitosamente', {
      description: `${shortCode || 'Código generado'} → ${targetUrl}`,
      duration: 3000,
    });

    // Reset form
    setTargetUrl('');
    setShortCode('');
    setCampaign('');
    setTags('');
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)] pointer-events-auto"
              style={{
                border: '1px solid var(--yes-border-medium)',
                boxShadow: 'var(--yes-shadow-lg)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--yes-border-subtle)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-[var(--yes-radius-md)] bg-[var(--yes-accent-light)]"
                    style={{ border: '1px solid var(--yes-border-subtle)' }}
                  >
                    <Sparkles className="w-5 h-5 text-[var(--yes-accent-primary)]" />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-semibold text-[var(--yes-text-primary)]"
                      style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      Crear Enlace Nuevo
                    </h2>
                    <p
                      className="text-xs text-[var(--yes-text-tertiary)]"
                      style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      Genera un enlace corto con analíticas integradas
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-[var(--yes-radius-sm)] hover:bg-[var(--yes-surface-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-[var(--yes-text-tertiary)]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Target URL */}
                <div>
                  <label
                    htmlFor="targetUrl"
                    className="block text-xs font-semibold text-[var(--yes-text-secondary)] mb-2"
                    style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                  >
                    URL DE DESTINO *
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--yes-text-tertiary)]" />
                    <input
                      id="targetUrl"
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://ejemplo.com/pagina-destino"
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--yes-surface-secondary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] placeholder:text-[var(--yes-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--yes-accent-primary)] transition-shadow disabled:opacity-50"
                      style={{
                        border: '1px solid var(--yes-border-subtle)',
                        letterSpacing: 'var(--letter-spacing-tight)',
                      }}
                    />
                  </div>
                </div>

                {/* Short Code */}
                <div>
                  <label
                    htmlFor="shortCode"
                    className="block text-xs font-semibold text-[var(--yes-text-secondary)] mb-2"
                    style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                  >
                    CÓDIGO CORTO
                    <span className="text-[var(--yes-text-tertiary)] font-normal ml-2">
                      (opcional - se generará automáticamente)
                    </span>
                  </label>
                  <input
                    id="shortCode"
                    type="text"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="mi-enlace-123"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[var(--yes-surface-secondary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] placeholder:text-[var(--yes-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--yes-accent-primary)] transition-shadow disabled:opacity-50"
                    style={{
                      border: '1px solid var(--yes-border-subtle)',
                      letterSpacing: 'var(--letter-spacing-tight)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                {/* Campaign */}
                <div>
                  <label
                    htmlFor="campaign"
                    className="block text-xs font-semibold text-[var(--yes-text-secondary)] mb-2"
                    style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                  >
                    CAMPAÑA *
                  </label>
                  <input
                    id="campaign"
                    type="text"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder="Q1 2024 Marketing / Lanzamiento Producto"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[var(--yes-surface-secondary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] placeholder:text-[var(--yes-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--yes-accent-primary)] transition-shadow disabled:opacity-50"
                    style={{
                      border: '1px solid var(--yes-border-subtle)',
                      letterSpacing: 'var(--letter-spacing-tight)',
                    }}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-xs font-semibold text-[var(--yes-text-secondary)] mb-2"
                    style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                  >
                    ETIQUETAS
                    <span className="text-[var(--yes-text-tertiary)] font-normal ml-2">
                      (separadas por comas)
                    </span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-[var(--yes-text-tertiary)]" />
                    <textarea
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="marketing, social, email, premium"
                      rows={2}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--yes-surface-secondary)] rounded-[var(--yes-radius-md)] text-sm text-[var(--yes-text-primary)] placeholder:text-[var(--yes-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--yes-accent-primary)] transition-shadow resize-none disabled:opacity-50"
                      style={{
                        border: '1px solid var(--yes-border-subtle)',
                        letterSpacing: 'var(--letter-spacing-tight)',
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-[var(--yes-radius-md)] bg-[var(--yes-surface-tertiary)] hover:bg-[var(--yes-surface-secondary)] text-sm font-semibold text-[var(--yes-text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: '1px solid var(--yes-border-subtle)',
                      letterSpacing: 'var(--letter-spacing-tight)',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-[var(--yes-radius-md)] bg-[var(--yes-accent-primary)] hover:bg-[var(--yes-accent-hover)] text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      letterSpacing: 'var(--letter-spacing-tight)',
                      boxShadow: 'var(--yes-shadow-sm)',
                    }}
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Enlace'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
