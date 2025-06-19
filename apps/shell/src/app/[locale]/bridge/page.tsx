import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { BridgePage } from '@haqq/shell-bridge';
import { parseWagmiCookies } from '@haqq/shell-shared';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ValidatorList() {
  const headersList = headers();
  const cookies = headersList.get('cookie');
  const { chainId } = parseWagmiCookies(cookies);

  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BridgePage chainId={chainId} />
    </HydrationBoundary>
  );
}
