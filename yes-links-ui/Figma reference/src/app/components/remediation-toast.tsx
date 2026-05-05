import { AlertCircle, CheckCircle2, XCircle, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface RemediationToastProps {
  type: ToastType;
  title: string;
  message: string;
  remediation?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  progress?: number; // For progress toasts (0-100)
}

export function RemediationToast({
  type,
  title,
  message,
  remediation,
  action,
  onDismiss,
  progress,
}: RemediationToastProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[var(--yes-success)]" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[var(--yes-error)]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[var(--yes-warning)]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[var(--yes-accent-primary)]" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'var(--yes-success-light)';
      case 'error':
        return 'var(--yes-error-light)';
      case 'warning':
        return 'var(--yes-warning-light)';
      default:
        return 'var(--yes-accent-light)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
      className="w-96 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)] overflow-hidden"
      style={{
        border: '1px solid var(--yes-border-subtle)',
        boxShadow: 'var(--yes-shadow-lg)',
      }}
    >
      {/* Progress Bar (if applicable) */}
      {progress !== undefined && (
        <div className="h-1 bg-[var(--yes-surface-tertiary)]">
          <motion.div
            className="h-full bg-[var(--yes-accent-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="p-2 rounded-[var(--yes-radius-md)]"
            style={{ backgroundColor: getBackgroundColor() }}
          >
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4
              className="text-sm font-semibold text-[var(--yes-text-primary)] mb-1"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {title}
            </h4>
            <p
              className="text-xs text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {message}
            </p>
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-[var(--yes-surface-tertiary)] rounded transition-colors"
            >
              <X className="w-4 h-4 text-[var(--yes-text-tertiary)]" />
            </button>
          )}
        </div>

        {/* Remediation Section */}
        {remediation && (
          <div
            className="mb-3 p-3 rounded-[var(--yes-radius-md)] bg-[var(--yes-surface-tertiary)]"
            style={{ border: '1px solid var(--yes-border-subtle)' }}
          >
            <div className="flex items-start gap-2 mb-2">
              <RefreshCw className="w-3.5 h-3.5 text-[var(--yes-accent-primary)] mt-0.5 flex-shrink-0" />
              <span
                className="text-xs font-semibold text-[var(--yes-text-primary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                REMEDIATION
              </span>
            </div>
            <p
              className="text-xs text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {remediation}
            </p>
          </div>
        )}

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="w-full px-4 py-2 bg-[var(--yes-accent-primary)] text-[var(--yes-text-on-accent)] rounded-[var(--yes-radius-md)] hover:bg-[var(--yes-accent-hover)] transition-colors"
            style={{
              border: '1px solid var(--yes-border-subtle)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            {action.label}
          </button>
        )}

        {/* Progress Info */}
        {progress !== undefined && (
          <div className="flex items-center justify-between mt-3 pt-3"
               style={{ borderTop: '1px solid var(--yes-border-subtle)' }}>
            <span
              className="text-xs text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Processing...
            </span>
            <span
              className="text-xs font-semibold text-[var(--yes-accent-primary)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {progress}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Example usage component for demonstration
export function RemediationToastDemo() {
  return (
    <div className="space-y-4 p-8">
      <RemediationToast
        type="error"
        title="Upload Failed"
        message="The CSV file contains invalid data in row 14."
        remediation="Check that all URLs are properly formatted and short codes are unique. Download the error log for detailed information."
        action={{
          label: 'Retry Upload',
          onClick: () => console.log('Retry'),
        }}
        onDismiss={() => console.log('Dismiss')}
      />

      <RemediationToast
        type="info"
        title="Procesamiento de Enlaces"
        message="Importando 47 enlaces desde archivo CSV"
        progress={65}
        action={{
          label: 'Run in Background',
          onClick: () => console.log('Background'),
        }}
      />

      <RemediationToast
        type="success"
        title="Links Created Successfully"
        message="12 new links have been added to your active links."
        onDismiss={() => console.log('Dismiss')}
      />
    </div>
  );
}