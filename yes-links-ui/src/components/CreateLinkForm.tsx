import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Plus } from 'lucide-react'
import { i18n } from '@/lib/i18n'

// Schema with translated remediation hints
const t = i18n.links
const schema = z.object({
  target_url: z.string()
    .url({ message: `${t.validation.urlInvalid} Remediation: ${t.validation.urlRemediation}` })
    .min(1, t.validation.urlRequired),
  campaign: z.string().optional(),
  tags: z.array(z.string())
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
    setValue,
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 rounded-xl border border-muted bg-background p-6 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="target_url" className="text-sm font-medium leading-none text-foreground">
          {t.targetUrl}
        </label>
        <input
          id="target_url"
          {...register('target_url')}
          placeholder={t.urlPlaceholder}
          className="flex h-10 w-full rounded-md border border-muted bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.target_url && (
          <div className="mt-1 flex flex-col space-y-1">
            <p className="text-xs font-medium text-destructive">
              {errors.target_url.message?.split(' Remediation: ')[0]}
            </p>
            <p className="text-[10px] text-muted-foreground italic">
              {errors.target_url.message?.split(' Remediation: ')[1]}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="campaign" className="text-sm font-medium leading-none text-foreground">
          {t.campaignOptional}
        </label>
        <input
          id="campaign"
          {...register('campaign')}
          placeholder={t.campaignPlaceholder}
          className="flex h-10 w-full rounded-md border border-muted bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tagsInput" className="text-sm font-medium leading-none text-foreground">
          {t.tagsOptional}
        </label>
        <input
          id="tagsInput"
          placeholder={t.tagsPlaceholder}
          className="flex h-10 w-full rounded-md border border-muted bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => {
            const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')
            setValue('tags', tags)
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center space-x-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t.creatingButton}</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>{t.createButton}</span>
          </>
        )}
      </button>
    </form>
  )
}
