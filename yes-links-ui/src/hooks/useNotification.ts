import { toast } from 'sonner'

interface ActionableError {
  message: string
  remediation?: string
  onRetry?: () => void
}

export const useNotification = () => {
  const error = (payload: ActionableError) => {
    toast.error(payload.message, {
      description: payload.remediation,
      action: payload.onRetry ? {
        label: 'Retry',
        onClick: payload.onRetry
      } : undefined,
      duration: 5000
    })
  }

  const success = (message: string) => {
    toast.success(message, {
      duration: 3000
    })
  }

  return {
    error,
    success
  }
}
