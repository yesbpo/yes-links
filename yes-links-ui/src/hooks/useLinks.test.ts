import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLinks } from './useLinks';

describe('useLinks Hook', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total: 0 }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('fails if default limit is greater than 20', async () => {
    renderHook(() => useLinks({}));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const url = new URL(fetchCall[0] as string, 'http://localhost');
    const limit = url.searchParams.get('limit');
    
    expect(Number(limit)).toBeLessThanOrEqual(20);
  });

  it('propagates x-request-id in headers', async () => {
    renderHook(() => useLinks({}));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const options = fetchCall[1] as RequestInit;
    const headers = options?.headers as Record<string, string>;
    
    expect(headers).toHaveProperty('x-request-id');
    expect(headers['x-request-id']).toBeDefined();
  });

  it('applies filters correctly', async () => {
    renderHook(() => useLinks({ tags: 'promo,social', campaign: 'summer' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const url = new URL(fetchCall[0] as string, 'http://localhost');
    
    expect(url.searchParams.get('tags')).toBe('promo,social');
    expect(url.searchParams.get('campaign')).toBe('summer');
  });

  it('aborts previous requests on rapid changes', async () => {
    const { rerender } = renderHook((props: any) => useLinks(props), {
      initialProps: { search: 'a' }
    });

    rerender({ search: 'ab' });
    rerender({ search: 'abc' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Check if AbortSignal is passed
    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const options = fetchCall[1] as RequestInit;
    
    expect(options.signal).toBeDefined();
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });
});
