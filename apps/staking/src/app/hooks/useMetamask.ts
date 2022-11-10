import { useCallback, useEffect, useMemo, useRef } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { getChainParams } from '../chains';
import { environment } from '../../environments/environment';
import { useConnect, useDisconnect, useNetwork } from 'wagmi';

interface MetamaskHook {
  connect: () => void;
  disconnect: () => void;
  selectNetwork: () => Promise<void>;
  isNetworkSupported: boolean;
}

export function useMetamask(): MetamaskHook {
  const onboardingRef = useRef<MetaMaskOnboarding>();
  const chainProperties = getChainParams(environment.chain);
  const { chain: currentChain } = useNetwork();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (onboardingRef.current !== undefined) {
      onboardingRef.current = new MetaMaskOnboarding();
    }
  }, []);

  const handleWalletConnect = useCallback(() => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardingRef.current?.startOnboarding();
    } else {
      connect({ connector: connectors[0] });
    }
  }, [connect, connectors]);

  const handleNetworkChange = useCallback(async () => {
    const { ethereum } = window;

    if (ethereum && chainProperties) {
      const chainId = `0x${chainProperties.id.toString(16)}`;

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId,
                  chainName: chainProperties.name,
                  nativeCurrency: {
                    name: chainProperties.nativeCurrency.name,
                    symbol: chainProperties.nativeCurrency.symbol,
                    decimals: chainProperties.nativeCurrency.decimals,
                  },
                  rpcUrls: [chainProperties.rpcUrls.default],
                },
              ],
            });
          } catch (addNetworkError) {
            console.error(addNetworkError);
          }
        }
        console.error(error);
      }
    } else {
      console.warn(
        'useMetamask(): handleNetworkChange window.ethereum is undefined',
      );
    }
  }, [chainProperties]);

  const isNetworkSupported = useMemo(() => {
    return currentChain ? !currentChain.unsupported : false;
  }, [currentChain]);

  return {
    connect: handleWalletConnect,
    disconnect,
    selectNetwork: handleNetworkChange,
    isNetworkSupported,
  };
}
