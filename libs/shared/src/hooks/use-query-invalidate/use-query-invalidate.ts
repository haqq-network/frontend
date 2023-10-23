import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useQueryInvalidate() {
  const queryClient = useQueryClient();

  return useCallback(
    (queries: Array<Array<unknown>>) => {
      for (const queryKey of queries) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    [queryClient],
  );
}
