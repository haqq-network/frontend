import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { BridgePage } from '@haqq/shell-bridge';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ValidatorList() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BridgePage />
    </HydrationBoundary>
  );
}
