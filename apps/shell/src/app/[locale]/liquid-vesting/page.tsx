import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { LiquidVestingPage } from '@haqq/shell-burn-waitlist';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function LiquidVestingRoutePage() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LiquidVestingPage />
    </HydrationBoundary>
  );
}
