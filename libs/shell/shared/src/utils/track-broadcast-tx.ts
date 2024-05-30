import { PostHog } from 'posthog-js';
import { BroadcastTxResponse } from '@haqq/data-access-cosmos';

export async function trackBroadcastTx(
  broadcastPromise: Promise<BroadcastTxResponse>,
  chainId: number,
  posthog: PostHog,
): Promise<BroadcastTxResponse> {
  try {
    posthog.capture('send tx start', {
      chainId,
      type: 'cosmos',
    });
    const txResponse = await broadcastPromise;
    posthog.capture('send tx success', {
      chainId,
      type: 'cosmos',
    });
    return txResponse;
  } catch (error) {
    posthog.capture('send tx fail', {
      chainId,
      type: 'cosmos',
    });
    throw error;
  }
}
