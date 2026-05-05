import { toast } from 'sonner';
import { RemediationToast, RemediationToastProps, ToastType } from '@/components/RemediationToast';
import { logger } from '@/lib/logger';
import { withTrace } from '@/lib/tracing';

export const notify = {
  success: (title: string, message: string, props?: Partial<RemediationToastProps>) => {
    toast.custom((t) => (
      <RemediationToast
        {...props}
        type="success"
        title={title}
        message={message}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 4000 });
  },
  
  error: (title: string, message: string, remediation?: string, action?: RemediationToastProps['action'], props?: Partial<RemediationToastProps>) => {
    toast.custom((t) => (
      <RemediationToast
        {...props}
        type="error"
        title={title}
        message={message}
        remediation={remediation}
        action={action ? {
          ...action,
          onClick: async () => {
            await withTrace('toast_retry_action', { 
              toast_title: title, 
              action_label: action.label 
            }, async () => {
              logger.info({ event: 'toast_retry_clicked', action: action.label }, `Retrying from toast: ${action.label}`);
              action.onClick();
            });
            toast.dismiss(t);
          }
        } : undefined}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 8000 });
  },

  warning: (title: string, message: string, props?: Partial<RemediationToastProps>) => {
    toast.custom((t) => (
      <RemediationToast
        {...props}
        type="warning"
        title={title}
        message={message}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 6000 });
  },

  info: (title: string, message: string, props?: Partial<RemediationToastProps>) => {
    toast.custom((t) => (
      <RemediationToast
        {...props}
        type="info"
        title={title}
        message={message}
        onDismiss={() => toast.dismiss(t)}
      />
    ), { duration: 4000 });
  },

  progress: (title: string, message: string, progress: number, props?: Partial<RemediationToastProps>) => {
    return toast.custom((t) => (
      <RemediationToast
        {...props}
        type="info"
        title={title}
        message={message}
        progress={progress}
      />
    ), { id: `progress-${title}`, duration: Infinity });
  },
  
  dismiss: (id?: string | number) => toast.dismiss(id),
};
