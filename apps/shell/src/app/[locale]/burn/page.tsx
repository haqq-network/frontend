import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { MintPage } from '@haqq/shell-burn-waitlist';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BurnMintPage() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MintPage />
    </HydrationBoundary>
  );
}
