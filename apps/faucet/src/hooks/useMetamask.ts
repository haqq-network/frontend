// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  useCallback,
  useEffect,
  // useLayoutEffect,
  // useMemo,
  useRef,
  useState,
} from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { config } from '../config';

interface MetamaskHook {
  account: {
    address?: string;
    balance?: string;
  };
  connect: () => void;
  selectNetwork: () => Promise<void>;
  networkNeedsChange: () => Promise<boolean>;
}

export function useMetamask(): MetamaskHook {
  const [address, setAddress] = useState<string>();
  // const [balance, setBalance] = useState<string>();
  const onboardingRef = useRef<MetaMaskOnboarding>();
  const { chainProperties } = config;

  useEffect(() => {
    if (onboardingRef.current !== undefined) {
      onboardingRef.current = new MetaMaskOnboarding();
    }
  }, []);

  const handleAccountsChange = useCallback(
    (accounts: Array<string>) => {
      if (address !== accounts[0]) {
        setAddress(accounts[0]);
      }
    },
    [address],
  );

  const handleWalletConnect = useCallback(() => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardingRef.current?.startOnboarding();
    } else {
      const { ethereum } = window;

      if (ethereum) {
        ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(handleAccountsChange);
      }
    }
  }, [handleAccountsChange]);

  // const handleGetBalance = useCallback(async (address: string) => {
  //   const { ethereum } = window;

  //   if (ethereum) {
  //     const balance = await ethereum.request({
  //       method: 'eth_getBalance',
  //       params: [address, 'latest'],
  //     });

  //     setBalance(balance);
  //   }
  // }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const { ethereum } = window;

      if (ethereum) {
        ethereum.on('accountsChanged', handleAccountsChange);

        return () => {
          ethereum.removeListener('accountsChanged', handleAccountsChange);
        };
      }
    }
  }, [handleAccountsChange]);

  // const handleChainChange = useCallback((chain: any) => {
  //   console.log('handleChainChange', { chain });
  // }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const { ethereum } = window;

      if (ethereum) {
        ethereum.on('accountsChanged', handleAccountsChange);
        // ethereum.on('chainChanged', handleChainChange);

        return () => {
          ethereum.removeListener('accountsChanged', handleAccountsChange);
          // ethereum.removeListener('chainChanged', handleChainChange);
        };
      }
    }
  }, [handleAccountsChange]);

  const handleNetworkChange = useCallback(async () => {
    const { ethereum } = window;

    if (ethereum && chainProperties) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainProperties.chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainProperties.chainId,
                  chainName: chainProperties.chainName,
                  nativeCurrency: {
                    name: 'Islamic Coin',
                    symbol: chainProperties.symbol,
                    decimals: chainProperties.decimals,
                  },
                  rpcUrls: [chainProperties.endpoint],
                },
              ],
            });
          } catch (addError) {
            console.error(error);
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

  const handleNetworkNeedsChange = useCallback(async () => {
    const { ethereum } = window;

    const chainId = await ethereum?.request({
      method: 'eth_chainId',
      params: [],
    });

    return chainId != chainProperties?.chainId;
  }, [chainProperties]);

  return {
    account: {
      address,
    },
    connect: handleWalletConnect,
    selectNetwork: handleNetworkChange,
    networkNeedsChange: handleNetworkNeedsChange,
  };
}
