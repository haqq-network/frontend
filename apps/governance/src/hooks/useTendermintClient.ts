import { useContext } from 'react';
import { TendermintClientContext } from '../providers/cosmos-provider';

export function useTendermintClient() {
  const tendermintClient = useContext(TendermintClientContext);

  if (!tendermintClient) {
    throw new Error(
      'useTendermintClient should be used only from child of TendermintClientContext',
    );
  }

  return tendermintClient;
}
