import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Plus } from 'lucide-react'

// Schema with remediation hints
const schema = z.object({
  target_url: z.string()
    .url({ message: 'Invalid URL format. Remediation: Ensure it starts with http:// or https:// and has a valid domain.' })
    .min(1, 'Target URL is required'),
  campaign: z.string().optional(),
  tags: z.array(z.string()).default([])
})

type FormValues = z.infer<typeof schema>

interface CreateLinkFormProps {
  onSubmit: (data: FormValues) => Promise<void>
  isSubmitting: boolean
}

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tags: []
    }
  })

  const onFormSubmit = async (data: FormValues) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="yes-link-space-y-4 yes-link-rounded-xl yes-link-border yes-link-border-muted yes-link-bg-background yes-link-p-6 yes-link-shadow-sm">
      <div className="yes-link-space-y-2">
        <label htmlFor="target_url" className="yes-link-text-sm yes-link-font-medium yes-link-leading-none yes-link-text-foreground">
          Target URL
        </label>
        <input
          id="target_url"
          {...register('target_url')}
          placeholder="https://example.com/promo"
          className="yes-link-flex yes-link-h-10 yes-link-w-full yes-link-rounded-md yes-link-border yes-link-border-muted yes-link-bg-background yes-link-px-3 yes-link-py-2 yes-link-text-sm yes-link-ring-offset-background file:yes-link-border-0 file:yes-link-bg-transparent file:yes-link-text-sm file:yes-link-font-medium placeholder:yes-link-text-muted-foreground focus-visible:yes-link-outline-none focus-visible:yes-link-ring-2 focus-visible:yes-link-ring-primary focus-visible:yes-link-ring-offset-2 disabled:yes-link-cursor-not-allowed disabled:yes-link-opacity-50"
        />
        {errors.target_url && (
          <div className="yes-link-mt-1 yes-link-flex yes-link-flex-col yes-link-space-y-1">
            <p className="yes-link-text-xs yes-link-font-medium yes-link-text-destructive">
              {errors.target_url.message?.split('. Remediation: ')[0]}
            </p>
            <p className="yes-link-text-[10px] yes-link-text-muted-foreground yes-link-italic">
              {errors.target_url.message?.split('. Remediation: ')[1]}
            </p>
          </div>
        )}
      </div>

      <div className="yes-link-space-y-2">
        <label htmlFor="campaign" className="yes-link-text-sm yes-link-font-medium yes-link-leading-none yes-link-text-foreground">
          Campaign (Optional)
        </label>
        <input
          id="campaign"
          {...register('campaign')}
          placeholder="summer-sale-2026"
          className="yes-link-flex yes-link-h-10 yes-link-w-full yes-link-rounded-md yes-link-border yes-link-border-muted yes-link-bg-background yes-link-px-3 yes-link-py-2 yes-link-text-sm yes-link-ring-offset-background file:yes-link-border-0 file:yes-link-bg-transparent file:yes-link-text-sm file:yes-link-font-medium placeholder:yes-link-text-muted-foreground focus-visible:yes-link-outline-none focus-visible:yes-link-ring-2 focus-visible:yes-link-ring-primary focus-visible:yes-link-ring-offset-2 disabled:yes-link-cursor-not-allowed disabled:yes-link-opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="yes-link-flex yes-link-w-full yes-link-items-center yes-link-justify-center yes-link-space-x-2 yes-link-rounded-md yes-link-bg-primary yes-link-px-4 yes-link-py-2 yes-link-text-sm yes-link-font-semibold yes-link-text-primary-foreground yes-link-transition-colors hover:yes-link-bg-primary/90 disabled:yes-link-opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="yes-link-h-4 yes-link-w-4 yes-link-animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          <>
            <Plus className="yes-link-h-4 yes-link-w-4" />
            <span>Create Link</span>
          </>
        )}
      </button>
    </form>
  )
}
