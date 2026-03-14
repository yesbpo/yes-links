'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, RefreshCw, X, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { logger } from '@/lib/logger';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface RemediationToastProps {
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
  progressLabel?: string;
}

export function RemediationToast({
  type,
  title,
  message,
  remediation,
  action,
  onDismiss,
  progress,
  progressLabel = 'Procesando...',
}: RemediationToastProps) {
  // Observability: Log toast event
  React.useEffect(() => {
    logger.info({
      event: 'toast_rendered',
      toast_type: type,
      toast_title: title,
    }, `Toast rendered: ${title}`);
  }, [type, title]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'info':
        return <Info className="h-5 w-5 text-info" />;
      default:
        return <AlertCircle className="h-5 w-5 text-primary" />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'success':
        return 'bg-success/10';
      case 'error':
        return 'bg-destructive/10';
      case 'warning':
        return 'bg-warning/10';
      case 'info':
        return 'bg-info/10';
      default:
        return 'bg-accent';
    }
  };

  return (
    <div
      className={cn(
        "yes-link-root w-[380px] overflow-hidden rounded-lg border border-muted bg-background shadow-lg",
        "animate-in slide-in-from-right-full duration-300 ease-out"
      )}
    >
      {/* Progress Bar (if applicable) */}
      {progress !== undefined && (
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-sm">
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <div className={cn("rounded-md p-2", getIconBackground())}>
            {getIcon()}
          </div>
          
          <div className="min-w-0 flex-1">
            <h4 className="mb-1 text-sm font-semibold tracking-tight text-foreground">
              {title}
            </h4>
            <p className="text-xs tracking-tight text-muted-foreground">
              {message}
            </p>
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="rounded p-1 transition-colors hover:bg-muted"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Remediation Section */}
        {remediation && (
          <div className="mb-3 rounded-md border border-muted/50 bg-muted p-3">
            <div className="mb-2 flex items-start gap-2">
              <RefreshCw className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">
                REMEDIATION
              </span>
            </div>
            <p className="text-xs tracking-tight text-muted-foreground">
              {remediation}
            </p>
          </div>
        )}

        {/* Action Button */}
        {action && (
          <button
            onClick={() => {
              logger.info({ event: 'toast_action_clicked', action_label: action.label }, `Toast action clicked: ${action.label}`);
              action.onClick();
            }}
            className="w-full rounded-md border border-primary/10 bg-primary px-4 py-2 text-xs font-medium tracking-tight text-primary-foreground transition-opacity hover:opacity-90"
          >
            {action.label}
          </button>
        )}

        {/* Progress Info */}
        {progress !== undefined && (
          <div className="mt-3 flex items-center justify-between border-t border-muted pt-3">
            <span className="text-[10px] tracking-tight text-muted-foreground">
              {progressLabel}
            </span>
            <span className="text-[10px] font-mono font-semibold text-primary">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
