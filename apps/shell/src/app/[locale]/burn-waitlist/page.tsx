import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { WaitlistPage } from '@haqq/shell-burn-waitlist';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BurnWaitlistPage() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WaitlistPage />
    </HydrationBoundary>
  );
}
