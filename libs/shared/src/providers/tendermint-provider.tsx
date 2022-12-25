import { createContext, useContext } from 'react';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { getChainParams } from '../chains/get-chain-params';

export const TendermintClientContext = createContext<
  Tendermint34Client | undefined
>(undefined);

export async function createTendermintClient({
  chainName,
}: {
  chainName: string;
}) {
  const { tmRpcEndpoint } = getChainParams(chainName);
  const tmClient = await Tendermint34Client.connect(tmRpcEndpoint);
  // const tmWsClient = new WebsocketClient(tmRpcWsEndpoint);
  // const tmClient = await Tendermint34Client.create(tmWsClient);

  return tmClient;
}

export function useTendermintClient() {
  const tendermintClient = useContext(TendermintClientContext);

  if (!tendermintClient) {
    throw new Error(
      'useTendermintClient should be used only from child of TendermintClientContext',
    );
  }

  return tendermintClient;
}
