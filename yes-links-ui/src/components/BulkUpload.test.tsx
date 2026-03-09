import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BulkUpload } from './BulkUpload'

describe('BulkUpload (Phase 2 Resilience)', () => {
  it('should render dropzone and accept CSV files', () => {
    render(<BulkUpload onProcess={vi.fn()} isProcessing={false} />)
    expect(screen.getByText(/upload csv/i)).toBeDefined()
    expect(screen.getByText(/drag and drop your file here/i)).toBeDefined()
  })

  it('should call onProcess when a file is selected', async () => {
    const onProcess = vi.fn().mockResolvedValue({})
    render(<BulkUpload onProcess={onProcess} isProcessing={false} />)
    
    const file = new File(['target_url,campaign\nhttps://example.com,promo'], 'links.csv', { type: 'text/csv' })
    const input = screen.getByTestId('file-input')
    
    fireEvent.change(input, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(onProcess).toHaveBeenCalled()
    })
  })

  it('should show progress and disable input while processing', () => {
    render(<BulkUpload onProcess={vi.fn()} isProcessing={true} progress={45} />)
    expect(screen.getByText(/processing 45%/i)).toBeDefined()
    const input = screen.getByTestId('file-input') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })
})
