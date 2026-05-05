import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RemediationToast } from './RemediationToast';

describe('RemediationToast', () => {
  it('renders success toast correctly', () => {
    render(
      <RemediationToast
        type="success"
        title="Success Title"
        message="Success message"
      />
    );

    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders error toast with remediation and action button', () => {
    const onRetry = vi.fn();
    render(
      <RemediationToast
        type="error"
        title="Error Title"
        message="Error message"
        remediation="Check your connection"
        action={{ label: 'Retry', onClick: onRetry }}
      />
    );

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('REMEDIATION')).toBeInTheDocument();
    expect(screen.getByText('Check your connection')).toBeInTheDocument();
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders progress bar when progress is provided', () => {
    render(
      <RemediationToast
        type="info"
        title="Progress Title"
        message="Uploading files..."
        progress={65}
      />
    );

    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('Uploading files...')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <RemediationToast
        type="info"
        title="Dismiss Title"
        message="Dismiss message"
        onDismiss={onDismiss}
      />
    );

    const closeButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(closeButton);
    expect(onDismiss).toHaveBeenCalled();
  });
});
