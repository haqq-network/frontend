'use client';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { hashMessage } from '@ethersproject/hash';
import { computePublicKey, recoverPublicKey } from '@ethersproject/signing-key';
import { cosmos as cosmosTx } from '@evmos/proto/dist/proto/cosmos/tx/v1beta1/tx';
import {
  Sender,
  signatureToWeb3Extension,
  createTxRawEIP712,
  TxGenerated,
} from '@evmos/transactions';
import { ec as EC } from 'elliptic';
import { usePostHog } from 'posthog-js/react';
import store from 'store2';
import type { Hex } from 'viem';
import { publicKeyToAddress } from 'viem/utils';
import {
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import '@wagmi/core/window';
import { getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { useCosmosService } from './cosmos-provider';
import { useSupportedChains } from './wagmi-provider';
import { ethToHaqq, haqqToEth } from '../utils/convert-address';

export interface WalletProviderInterface {
  disconnect: () => void;
  selectNetwork: (chainId: number) => Promise<void>;
  isNetworkSupported: boolean;
  openSelectWallet: () => void;
  closeSelectWallet: () => void;
  isSelectWalletOpen: boolean;
  openSelectChain: () => void;
  closeSelectChain: () => void;
  isSelectChainOpen: boolean;
  isHaqqWallet: boolean;
  watchAsset: (denom: string, contractAddress: string) => Promise<void>;
  isLowBalanceAlertOpen: boolean;
  openLowBalanceAlert: () => void;
  closeLowBalanceAlert: () => void;
  generatePubkey: (address: string) => Promise<string>;
  getPubkey: (address: string) => Promise<string>;
  signTransaction: (
    msg: TxGenerated,
    sender: Sender,
  ) => Promise<{
    path: string;
    message: cosmosTx.tx.v1beta1.TxRaw;
  }>;
}

const WalletContext = createContext<WalletProviderInterface | undefined>(
  undefined,
);

function base64ToUncompressedHex(base64: string): Hex {
  const buffer = Buffer.from(base64, 'base64');
  const ec = new EC('secp256k1');
  const key = ec.keyFromPublic(buffer);
  const uncompressed = key.getPublic(false, 'hex');

  return `0x${uncompressed}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);
  const [isSelectChainModalOpen, setSelectChainModalOpen] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [isLowBalanceAlertOpen, setLowBalanceAlertOpen] = useState(false);
  const { getPubkeyFromChain } = useCosmosService();
  const chainParams = getChainParams(
    chain.unsupported !== undefined && !chain.unsupported
      ? chain.id
      : chains[0].id,
  );
  const haqqChain = mapToCosmosChain(chainParams);
  const posthog = usePostHog();

  const handleNetworkChange = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
      } else {
        console.warn('useWallet(): handleNetworkChange error');
      }
    },
    [switchNetworkAsync],
  );

  const isNetworkSupported = useMemo(() => {
    return chain && chain.unsupported !== undefined
      ? !chain.unsupported
      : false;
  }, [chain]);

  const handleWatchAsset = useCallback(
    async (denom: string, contractAddress: string) => {
      try {
        posthog.capture('watch asset start', {
          chaidId: haqqChain.chainId,
        });
        await walletClient?.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: contractAddress,
              decimals: 18,
              name: denom,
              symbol: denom,
            },
          },
        });
        posthog.capture('watch asset success', {
          chaidId: haqqChain.chainId,
        });
      } catch (error) {
        const message = (error as Error).message;
        posthog.capture('watch asset failed', {
          chaidId: haqqChain.chainId,
          error: message,
        });
        console.error(message);
      }
    },
    [haqqChain.chainId, posthog, walletClient],
  );

  const generatePubkey = useCallback(
    async (address: string) => {
      if (walletClient) {
        const message = 'Verify Public Key';
        const signature = await walletClient.request<{
          Method: 'personal_sign';
          Parameters: [message: string, address: string];
          ReturnType: Hex;
        }>({
          method: 'personal_sign',
          params: [message, address],
        });

        if (signature) {
          const uncompressedPk = recoverPublicKey(
            hashMessage(message),
            signature,
          );
          const hexPk = computePublicKey(uncompressedPk, true);
          const pk = Buffer.from(hexPk.replace('0x', ''), 'hex').toString(
            'base64',
          );

          return pk;
        } else {
          throw new Error('No signature');
        }
      } else {
        throw new Error('No walletClient');
      }
    },
    [walletClient],
  );

  const validatePubkey = useCallback((address: string, pubkey: string) => {
    try {
      const pkUncompressedHex = base64ToUncompressedHex(pubkey);
      const recoveredAddress = publicKeyToAddress(pkUncompressedHex);

      return address.toLowerCase() === recoveredAddress.toLowerCase();
    } catch (error) {
      console.error('Failed to validate pubkey');
      return false;
    }
  }, []);

  const fetchPubkey = useCallback(
    async (address: string) => {
      const haqqAddress = ethToHaqq(address);
      let pubkey = await getPubkeyFromChain(haqqAddress);

      if (!pubkey) {
        pubkey = await generatePubkey(address);
      }

      return pubkey;
    },
    [generatePubkey, getPubkeyFromChain],
  );

  const getPubkey = useCallback(
    async (address: string) => {
      const storeKey = `pubkey_${address}`;

      try {
        posthog.capture('get pubkey start', {
          chaidId: haqqChain.chainId,
          address,
        });

        let savedPubKey: string | null = store.get(storeKey);

        if (!savedPubKey) {
          const pubkey = await fetchPubkey(address);

          store.set(storeKey, pubkey);
          savedPubKey = pubkey;
        }

        const isValid = validatePubkey(address, savedPubKey);

        if (!isValid) {
          store.remove(storeKey);

          const pubkey = await fetchPubkey(address);

          store.set(storeKey, pubkey);

          const isValidAfterRetry = validatePubkey(address, pubkey);

          if (!isValidAfterRetry) {
            const errorMessage = 'Invalid public key after retry';
            posthog.capture('get pubkey failed', {
              chaidId: haqqChain.chainId,
              address,
              error: errorMessage,
            });
            console.error(errorMessage);
            throw new Error(errorMessage);
          }

          posthog.capture('get pubkey success', {
            chaidId: haqqChain.chainId,
            address,
          });

          return pubkey;
        }

        posthog.capture('get pubkey success', {
          chaidId: haqqChain.chainId,
          address,
        });

        return savedPubKey;
      } catch (error) {
        const message = (error as Error).message;
        posthog.capture('get pubkey failed', {
          chaidId: haqqChain.chainId,
          address,
          error: message,
        });
        console.error(message);
        throw error;
      }
    },
    [fetchPubkey, haqqChain.chainId, posthog, validatePubkey],
  );

  const signTransaction = useCallback(
    async (msg: TxGenerated, sender: Sender) => {
      if (haqqChain && walletClient) {
        posthog.capture('sign tx start', { chaidId: haqqChain.chainId });
        const ethAddress = haqqToEth(sender.accountAddress);
        const signature = await walletClient.request({
          method: 'eth_signTypedData_v4',
          params: [ethAddress as Hex, JSON.stringify(msg.eipToSign)],
        });
        console.log({ signature });
        const extension = signatureToWeb3Extension(
          haqqChain,
          sender,
          signature,
        );
        console.log({ extension });
        const rawTx = createTxRawEIP712(
          msg.legacyAmino.body,
          msg.legacyAmino.authInfo,
          extension,
        );
        console.log({ rawTx });

        posthog.capture('sign tx success', {
          chaidId: haqqChain.chainId,
        });

        return rawTx;
      } else {
        posthog.capture('sign tx failed', {
          chaidId: haqqChain.chainId,
        });
        throw new Error('No haqqChain');
      }
    },
    [haqqChain, posthog, walletClient],
  );

  const memoizedContext = useMemo(() => {
    return {
      disconnect,
      selectNetwork: handleNetworkChange,
      isNetworkSupported,
      openSelectWallet: () => {
        setWalletSelectModalOpen(true);
      },
      closeSelectWallet: () => {
        setWalletSelectModalOpen(false);
      },
      isSelectWalletOpen: isWalletSelectModalOpen,
      openSelectChain: () => {
        setSelectChainModalOpen(true);
      },
      closeSelectChain: () => {
        setSelectChainModalOpen(false);
      },
      isSelectChainOpen: isSelectChainModalOpen,
      isHaqqWallet:
        typeof window !== 'undefined'
          ? Boolean(window.ethereum?.isHaqqWallet)
          : false,
      watchAsset: handleWatchAsset,
      isLowBalanceAlertOpen,
      openLowBalanceAlert: () => {
        setLowBalanceAlertOpen(true);
      },
      closeLowBalanceAlert: () => {
        setLowBalanceAlertOpen(false);
      },
      generatePubkey,
      getPubkey,
      signTransaction,
    };
  }, [
    disconnect,
    handleNetworkChange,
    isNetworkSupported,
    isWalletSelectModalOpen,
    isSelectChainModalOpen,
    handleWatchAsset,
    isLowBalanceAlertOpen,
    generatePubkey,
    getPubkey,
    signTransaction,
  ]);

  return (
    <WalletContext.Provider value={memoizedContext}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const walletService = useContext(WalletContext);

  if (!walletService) {
    throw new Error(
      'useWallet should be used only from child of WalletProvider',
    );
  }

  return walletService;
}
