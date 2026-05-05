import { BarChart3, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AnalyticsWidgets } from '../components/analytics-widgets';
import { mockAnalytics } from '../data/mockData';

export default function GlobalStats() {
  const handleExport = () => {
    toast.success('Exportación Iniciada', {
      description: 'Se está generando tu reporte de analíticas...',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-[var(--yes-radius-md)] bg-[var(--yes-surface-tertiary)]"
            style={{ border: '1px solid var(--yes-border-subtle)' }}
          >
            <BarChart3 className="w-5 h-5 text-[var(--yes-accent-primary)]" />
          </div>
          <div>
            <h1
              className="text-2xl font-semibold text-[var(--yes-text-primary)] mb-1"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Estadísticas Globales
            </h1>
            <p
              className="text-sm text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Analíticas y métricas de rendimiento de todos los enlaces
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--yes-surface-primary)] text-[var(--yes-text-primary)] rounded-[var(--yes-radius-md)] hover:bg-[var(--yes-surface-tertiary)] transition-colors"
          style={{
            border: '1px solid var(--yes-border-subtle)',
            boxShadow: 'var(--yes-shadow-md)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}
        >
          <Download className="w-4 h-4" />
          <span>Exportar Reporte</span>
        </button>
      </div>

      {/* Analytics Widgets */}
      <AnalyticsWidgets data={mockAnalytics} />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performing Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)]"
          style={{
            border: '1px solid var(--yes-border-subtle)',
            boxShadow: 'var(--yes-shadow-md)',
          }}
        >
          <h3
            className="text-base font-semibold text-[var(--yes-text-primary)] mb-4"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            Enlaces con Mejor Rendimiento
          </h3>
          
          <div className="space-y-3">
            {[
              { code: 'WEB-DEMO', clicks: 4291, change: '+12%' },
              { code: 'EVENT-24', clicks: 3156, change: '+8%' },
              { code: 'PRD-2024', clicks: 2847, change: '+15%' },
            ].map((link, index) => (
              <div
                key={link.code}
                className="flex items-center justify-between p-3 rounded-[var(--yes-radius-md)] bg-[var(--yes-surface-tertiary)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded bg-[var(--yes-accent-light)] text-xs font-semibold text-[var(--yes-accent-primary)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {index + 1}
                  </div>
                  <span
                    className="text-sm font-semibold text-[var(--yes-text-primary)]"
                    style={{ fontFamily: 'var(--font-mono)', letterSpacing: 'var(--letter-spacing-tight)' }}
                  >
                    {link.code}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-semibold text-[var(--yes-text-primary)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {link.clicks.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[var(--yes-success)] px-2 py-1 rounded bg-[var(--yes-success-light)]">
                    {link.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)]"
          style={{
            border: '1px solid var(--yes-border-subtle)',
            boxShadow: 'var(--yes-shadow-md)',
          }}
        >
          <h3
            className="text-base font-semibold text-[var(--yes-text-primary)] mb-4"
            style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
          >
            Actividad Reciente
          </h3>
          
          <div className="space-y-4">
            {[
              { action: 'Enlace creado', code: 'CASE-FIN', time: 'hace 2 horas' },
              { action: 'Clics registrados', code: 'DOCS-API', time: 'hace 5 horas' },
              { action: 'Enlace compartido', code: 'OLD-PROMO', time: 'hace 1 día' },
              { action: 'Enlace copiado', code: 'CAMPAIGN-Q4', time: 'hace 2 días' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full bg-[var(--yes-accent-primary)] mt-1.5 flex-shrink-0"
                  style={{ boxShadow: '0 0 0 4px var(--yes-accent-light)' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-sm text-[var(--yes-text-primary)]"
                      style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      {activity.action}
                    </span>
                    <span
                      className="text-sm font-semibold text-[var(--yes-text-primary)]"
                      style={{ fontFamily: 'var(--font-mono)', letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      {activity.code}
                    </span>
                  </div>
                  <div
                    className="text-xs text-[var(--yes-text-tertiary)] mt-0.5"
                    style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                  >
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info Banner */}
      
    </div>
  );
}