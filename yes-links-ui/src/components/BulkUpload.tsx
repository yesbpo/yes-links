import React, { useRef } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { i18n } from '@/lib/i18n'

interface BulkUploadProps {
  onProcess: (file: File) => Promise<void>
  isProcessing: boolean
  progress?: number
  onComplete?: () => void
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ 
  onProcess, 
  isProcessing, 
  progress = 0,
  onComplete 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = i18n.bulk

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onProcess(file)
      if (onComplete) onComplete()
    }
  }

  const triggerInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div 
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
        isProcessing 
          ? 'border-primary/50 bg-primary/5' 
          : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <input
        type="file"
        data-testid="file-input"
        className="hidden"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isProcessing}
        ref={fileInputRef}
      />

      {isProcessing ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {t.processing.replace('{progress}', progress.toString())}
            </p>
            <p className="text-xs text-muted-foreground">{t.uploading}</p>
          </div>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div 
          className="flex cursor-pointer flex-col items-center space-y-3"
          onClick={triggerInput}
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-foreground">{t.title}</h3>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center space-x-2 rounded-md bg-muted px-3 py-1">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{t.supported}</span>
          </div>
        </div>
      )}
    </div>
  )
}
