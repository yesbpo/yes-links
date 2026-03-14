import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4 bg-[var(--yes-surface-primary)] rounded-[var(--yes-radius-lg)]"
      style={{
        border: '2px dashed var(--yes-border-subtle)',
      }}
    >
      {/* Wireframe-style icon illustration */}
      <div
        className="p-6 mb-6 rounded-[var(--yes-radius-xl)] bg-[var(--yes-surface-tertiary)] relative"
        style={{ border: '1px solid var(--yes-border-subtle)' }}
      >
        {/* Wireframe corners */}
        <div className="absolute top-0 left-0 w-4 h-4"
             style={{
               borderTop: '2px solid var(--yes-border-medium)',
               borderLeft: '2px solid var(--yes-border-medium)',
               borderTopLeftRadius: 'var(--yes-radius-md)',
             }}
        />
        <div className="absolute top-0 right-0 w-4 h-4"
             style={{
               borderTop: '2px solid var(--yes-border-medium)',
               borderRight: '2px solid var(--yes-border-medium)',
               borderTopRightRadius: 'var(--yes-radius-md)',
             }}
        />
        <div className="absolute bottom-0 left-0 w-4 h-4"
             style={{
               borderBottom: '2px solid var(--yes-border-medium)',
               borderLeft: '2px solid var(--yes-border-medium)',
               borderBottomLeftRadius: 'var(--yes-radius-md)',
             }}
        />
        <div className="absolute bottom-0 right-0 w-4 h-4"
             style={{
               borderBottom: '2px solid var(--yes-border-medium)',
               borderRight: '2px solid var(--yes-border-medium)',
               borderBottomRightRadius: 'var(--yes-radius-md)',
             }}
        />
        
        <Icon className="w-16 h-16 text-[var(--yes-text-tertiary)]" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <h3
        className="text-lg font-semibold text-[var(--yes-text-primary)] mb-2"
        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
      >
        {title}
      </h3>
      
      <p
        className="text-sm text-[var(--yes-text-secondary)] mb-6 text-center max-w-md"
        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
      >
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-[var(--yes-accent-primary)] text-[var(--yes-text-on-accent)] rounded-[var(--yes-radius-md)] hover:bg-[var(--yes-accent-hover)] transition-colors"
          style={{
            border: '1px solid var(--yes-border-subtle)',
            boxShadow: 'var(--yes-shadow-md)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
