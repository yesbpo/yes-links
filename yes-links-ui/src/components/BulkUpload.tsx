import React, { useRef } from 'react'
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react'

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
      className={`yes-link-relative yes-link-flex yes-link-flex-col yes-link-items-center yes-link-justify-center yes-link-rounded-xl yes-link-border-2 yes-link-border-dashed yes-link-p-8 yes-link-transition-all ${
        isProcessing 
          ? 'yes-link-border-primary/50 yes-link-bg-primary/5' 
          : 'yes-link-border-muted-foreground/20 hover:yes-link-border-primary/50 hover:yes-link-bg-muted/50'
      }`}
    >
      <input
        type="file"
        data-testid="file-input"
        className="yes-link-hidden"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isProcessing}
        ref={fileInputRef}
      />

      {isProcessing ? (
        <div className="yes-link-flex yes-link-flex-col yes-link-items-center yes-link-space-y-4">
          <Loader2 className="yes-link-h-10 yes-link-w-10 yes-link-animate-spin yes-link-text-primary" />
          <div className="yes-link-text-center">
            <p className="yes-link-text-sm yes-link-font-semibold yes-link-text-foreground">Processing {progress}%</p>
            <p className="yes-link-text-xs yes-link-text-muted-foreground">Uploading links to your campaign...</p>
          </div>
          {/* Progress Bar */}
          <div className="yes-link-h-1.5 yes-link-w-48 yes-link-overflow-hidden yes-link-rounded-full yes-link-bg-muted">
            <div 
              className="yes-link-h-full yes-link-bg-primary yes-link-transition-all yes-link-duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div 
          className="yes-link-flex yes-link-cursor-pointer yes-link-flex-col yes-link-items-center yes-link-space-y-3"
          onClick={triggerInput}
        >
          <div className="yes-link-rounded-full yes-link-bg-primary/10 yes-link-p-3">
            <Upload className="yes-link-h-6 yes-link-w-6 yes-link-text-primary" />
          </div>
          <div className="yes-link-text-center">
            <h3 className="yes-link-text-sm yes-link-font-bold yes-link-text-foreground">Upload CSV</h3>
            <p className="yes-link-text-xs yes-link-text-muted-foreground">Drag and drop your file here or click to browse</p>
          </div>
          <div className="yes-link-flex yes-link-items-center yes-link-space-x-2 yes-link-rounded-md yes-link-bg-muted yes-link-px-3 yes-link-py-1">
            <FileText className="yes-link-h-3 yes-link-w-3 yes-link-text-muted-foreground" />
            <span className="yes-link-text-[10px] yes-link-font-medium yes-link-text-muted-foreground">SUPPORTED: .CSV</span>
          </div>
        </div>
      )}
    </div>
  )
}
