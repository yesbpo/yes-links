import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from '@/components/LinkCard';
import { withTrace } from '@/lib/tracing';

type State = 'idle' | 'loading' | 'success' | 'error';

interface UseLinksParams {
  tags?: string;
  campaign?: string;
  search?: string;
  limit?: number;
}

interface UseLinksResult {
  links: Link[];
  state: State;
  error: Error | null;
  mutate: () => Promise<void>;
}

const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useLinks = (params: UseLinksParams = {}): UseLinksResult => {
  const [links, setLinks] = useState<Link[]>([]);
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Default limit 20
  const limit = params.limit ?? 20;
  const tags = params.tags;
  const campaign = params.campaign;
  const search = params.search;

  const fetchLinks = useCallback(async () => {
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setState('loading');
    setError(null);

    await withTrace('useLinks.fetch', { 
      tags: tags || 'none', 
      campaign: campaign || 'none',
      limit 
    }, async () => {
      try {
        const url = new URL('/api/v1/links', typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        url.searchParams.set('limit', limit.toString());
        if (tags) url.searchParams.set('tags', tags);
        if (campaign) url.searchParams.set('campaign', campaign);
        if (search) url.searchParams.set('search', search);

        const requestId = generateRequestId();

        const response = await fetch(url.toString(), {
          signal: abortController.signal,
          headers: {
            'x-request-id': requestId,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch links: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle race condition where a newer request was made
        if (!abortController.signal.aborted) {
          setLinks(data.items || []);
          setState('success');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // It's expected, don't change state to error
          return;
        }
        setState('error');
        setError(err);
      }
    });
  }, [tags, campaign, search, limit]);

  useEffect(() => {
    fetchLinks();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchLinks]);

  return { links, state, error, mutate: fetchLinks };
};
