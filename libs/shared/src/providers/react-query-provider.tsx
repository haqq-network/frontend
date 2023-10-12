import { ReactNode, useMemo } from 'react';
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function ReactQueryProvider({
  children,
  withDevtools = false,
}: {
  children: ReactNode;
  withDevtools?: boolean;
}) {
  const queryClient = useMemo(() => {
    return new ReactQueryClient({
      defaultOptions: {
        queries: {
          retryDelay: (attemptIndex: number) => {
            return Math.min(1000 * 2 ** attemptIndex, 30000);
          },
          staleTime: 30000,
          refetchInterval: 60000,
        },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {withDevtools && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
