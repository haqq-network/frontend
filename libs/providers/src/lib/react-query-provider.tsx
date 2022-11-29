import { ReactNode, useMemo } from 'react';
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => {
    return new ReactQueryClient({
      defaultOptions: {
        queries: {
          retryDelay: (attemptIndex: number) => {
            return Math.min(1000 * 2 ** attemptIndex, 30000);
          },
          // refetchOnWindowFocus: false,
        },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
