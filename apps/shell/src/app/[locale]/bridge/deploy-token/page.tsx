import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { TokenDeploymentPage } from '@haqq/shell-bridge';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function TokenDeployment() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TokenDeploymentPage />
    </HydrationBoundary>
  );
}
