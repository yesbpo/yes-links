'use client';

import { toast } from 'sonner';
import { RemediationToast, RemediationToastProps } from '@/components/RemediationToast';
import { logger } from '@/lib/logger';
import { withTrace } from '@/lib/tracing';

interface ActionableError {
  message: string;
  title?: string;
  remediation?: string;
  onRetry?: () => void;
}

export const useNotification = () => {
  const error = (payload: ActionableError) => {
    const title = payload.title || 'Error de Sistema';
    
    toast.custom((t) => (
      <RemediationToast
        type="error"
        title={title}
        message={payload.message}
        remediation={payload.remediation}
        action={payload.onRetry ? {
          label: 'Reintentar',
          onClick: async () => {
            await withTrace('notification_retry', { 
              title, 
              message: payload.message 
            }, async () => {
              logger.info({ event: 'notification_retry_clicked' }, `Retry clicked for: ${title}`);
              payload.onRetry?.();
            });
            toast.dismiss(t);
          }
        } : undefined}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 8000 });
  };

  const success = (message: string, title: string = 'Operación Exitosa') => {
    toast.custom((t) => (
      <RemediationToast
        type="success"
        title={title}
        message={message}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 4000 });
  };

  const info = (message: string, title: string = 'Información') => {
    toast.custom((t) => (
      <RemediationToast
        type="info"
        title={title}
        message={message}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 4000 });
  };

  const progress = (title: string, message: string, currentProgress: number) => {
    return toast.custom((t) => (
      <RemediationToast
        type="info"
        title={title}
        message={message}
        progress={currentProgress}
      />
    ), { id: `progress-${title}`, duration: Infinity });
  };

  return {
    error,
    success,
    info,
    progress,
    dismiss: (id?: string | number) => toast.dismiss(id)
  };
};
