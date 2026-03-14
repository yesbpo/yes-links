'use client'

import React, { useState } from 'react'
import { Link2, Sparkles, Tag, X } from 'lucide-react'

export interface CreateLinkPayload {
  target_url: string
  short_code?: string
  campaign?: string
  tags?: string[]
}

export interface CreateLinkOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (payload: CreateLinkPayload) => Promise<void> | void
}

export const CreateLinkOverlay: React.FC<CreateLinkOverlayProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [targetUrl, setTargetUrl] = useState('https://ejemplo.com/pagina-destino')
  const [shortCode, setShortCode] = useState('mi-enlace-123')
  const [campaign, setCampaign] = useState('Q1 2024 Marketing / Lanzamiento Producto')
  const [tags, setTags] = useState('marketing, social, email, premium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await (onSubmit
        ? onSubmit({
            target_url: targetUrl,
            short_code: shortCode || undefined,
            campaign: campaign || undefined,
            tags: tags
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean),
          })
        : new Promise((resolve) => setTimeout(resolve, 500)))
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[6px]"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          className="w-full max-w-[660px] rounded-2xl bg-[var(--yes-surface-primary)]"
          style={{
            border: '1px solid var(--yes-border-medium)',
            boxShadow: 'var(--yes-shadow-lg)',
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid var(--yes-border-subtle)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--yes-accent-light)]"
                style={{ border: '1px solid var(--yes-border-subtle)' }}
              >
                <Sparkles className="h-5 w-5 text-[var(--yes-accent-primary)]" />
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
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md p-2 transition-colors hover:bg-[var(--yes-surface-tertiary)] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close create link overlay"
            >
              <X className="h-5 w-5 text-[var(--yes-text-tertiary)]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label
                htmlFor="overlay-target-url"
                className="mb-2 block text-xs font-semibold text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                URL DE DESTINO *
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--yes-text-tertiary)]" />
                <input
                  id="overlay-target-url"
                  value={targetUrl}
                  onChange={(event) => setTargetUrl(event.target.value)}
                  className="w-full rounded-xl bg-[var(--yes-surface-secondary)] py-2.5 pl-10 pr-4 text-sm text-[var(--yes-text-primary)] outline-none transition-shadow focus:ring-2"
                  style={{
                    border: '1px solid var(--yes-border-subtle)',
                    boxShadow: '0 0 0 0 transparent',
                    letterSpacing: 'var(--letter-spacing-tight)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="overlay-short-code"
                className="mb-2 block text-xs font-semibold text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                CÓDIGO CORTO
                <span className="ml-2 font-normal text-[var(--yes-text-tertiary)]">
                  (opcional - se generará automáticamente)
                </span>
              </label>
              <input
                id="overlay-short-code"
                value={shortCode}
                onChange={(event) => setShortCode(event.target.value)}
                className="w-full rounded-xl bg-[var(--yes-surface-secondary)] px-4 py-2.5 text-sm text-[var(--yes-text-primary)] outline-none transition-shadow focus:ring-2"
                style={{
                  border: '1px solid var(--yes-border-subtle)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="overlay-campaign"
                className="mb-2 block text-xs font-semibold text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                CAMPAÑA *
              </label>
              <input
                id="overlay-campaign"
                value={campaign}
                onChange={(event) => setCampaign(event.target.value)}
                className="w-full rounded-xl bg-[var(--yes-surface-secondary)] px-4 py-2.5 text-sm text-[var(--yes-text-primary)] outline-none transition-shadow focus:ring-2"
                style={{
                  border: '1px solid var(--yes-border-subtle)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="overlay-tags"
                className="mb-2 block text-xs font-semibold text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                ETIQUETAS
                <span className="ml-2 font-normal text-[var(--yes-text-tertiary)]">
                  (separadas por comas)
                </span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-[var(--yes-text-tertiary)]" />
                <textarea
                  id="overlay-tags"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-xl bg-[var(--yes-surface-secondary)] py-2.5 pl-10 pr-4 text-sm text-[var(--yes-text-primary)] outline-none transition-shadow focus:ring-2"
                  style={{
                    border: '1px solid var(--yes-border-subtle)',
                    letterSpacing: 'var(--letter-spacing-tight)',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-[var(--yes-surface-tertiary)] px-4 py-2.5 text-sm font-semibold text-[var(--yes-text-primary)] transition-colors hover:bg-[var(--yes-surface-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'var(--yes-accent-primary)',
                  boxShadow: 'var(--yes-shadow-sm)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              >
                {isSubmitting ? 'Creando...' : 'Crear Enlace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
