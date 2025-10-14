import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { haqqTestedge2 } from 'wagmi/chains';
import { AuthProvider, FaucetPage } from '@haqq/shell-faucet';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
import { supportedChainsIds } from '../config/wagmi-config';
import { env } from '../env/client';

export default async function Faucet() {
  const cookies = headers().get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse =
    chainId && supportedChainsIds.includes(chainId)
      ? chainId
      : supportedChainsIds[0];

  if (chainIdToUse !== haqqTestedge2.id) {
    return notFound();
  }

  const queryClient = new QueryClient();

  if (walletAddress) {
    const haqqAddress = ethToHaqq(walletAddress);

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'indexer-balance', haqqAddress],
      queryFn: async () => {
        return await indexerBalancesFetcher(chainIdToUse, haqqAddress);
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuthProvider
        config={{
          auth0ClientId: env.NEXT_PUBLIC_FAUCET_AUTH0_CLIENT_ID,
          auth0Domain: env.NEXT_PUBLIC_FAUCET_AUTH0_DOMAIN,
        }}
      >
        <FaucetPage
          serviceEndpoint={env.NEXT_PUBLIC_FAUCET_SERVICE_ENDPOINT}
          reCaptchaSiteKey={env.NEXT_PUBLIC_FAUCET_RECAPTCHA_SITE_KEY}
        />
      </AuthProvider>
    </HydrationBoundary>
  );
}
