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
import type { Chain, Hex } from 'viem';
import { publicKeyToAddress } from 'viem/utils';
import 'viem/window';
import {
  useDisconnect,
  useAccount,
  useSwitchChain,
  useWalletClient,
  useChains,
  useConnectors,
  useConnect,
  Connector,
  Config,
  useChainId,
} from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { ConnectData } from 'wagmi/query';
import { getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { useCosmosService } from './cosmos-provider';
import { useAutoconnect } from '../hooks/use-autoconnect/use-autoconnect';
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
  connectors: { id: number; name: string }[];
  availableConnectors: readonly Connector[];
  connectError: string | null;
  setConnectError: (error: string | null) => void;
  connect: ({
    connector,
  }: {
    connector: Connector;
  }) => Promise<ConnectData<Config>>;
  supportedChains: readonly [Chain, ...Chain[]];
}

const WalletContext = createContext<WalletProviderInterface | null>(null);

function base64ToUncompressedHex(base64: string): Hex {
  const buffer = Buffer.from(base64, 'base64');
  const ec = new EC('secp256k1');
  const key = ec.keyFromPublic(buffer);
  const uncompressed = key.getPublic(false, 'hex');

  return `0x${uncompressed}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);
  const [isSelectChainModalOpen, setSelectChainModalOpen] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [isLowBalanceAlertOpen, setLowBalanceAlertOpen] = useState(false);
  const { getPubkeyFromChain } = useCosmosService();
  const posthog = usePostHog();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const availableConnectors = useConnectors();
  const availableChains = useChains();
  const [connectError, setConnectError] = useState<string | null>(null);
  const currentChainId = useChainId();

  const connectors = useMemo(() => {
    return availableConnectors.map((connector, index) => {
      return {
        id: index,
        name: connector.name,
      };
    });
  }, [availableConnectors]);

  const isChainSupported = useMemo(() => {
    return availableChains.some((chain) => {
      return currentChainId === chain.id;
    });
  }, [availableChains, currentChainId]);

  const chainParams = getChainParams(
    isChainSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const haqqChain = mapToCosmosChain(chainParams);

  const handleNetworkChange = useCallback(
    async (chainId: number) => {
      if (switchChainAsync) {
        await switchChainAsync({ chainId });
      }
    },
    [switchChainAsync],
  );

  const isNetworkSupported = isChainSupported;
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
      if (haqqChain) {
        if (walletClient) {
          posthog.capture('sign tx start', { chaidId: haqqChain.chainId });
          const ethAddress = haqqToEth(sender.accountAddress);
          const signature = await walletClient.request({
            method: 'eth_signTypedData_v4',
            params: [ethAddress as Hex, JSON.stringify(msg.eipToSign)],
          });
          const extension = signatureToWeb3Extension(
            haqqChain,
            sender,
            signature,
          );
          const rawTx = createTxRawEIP712(
            msg.legacyAmino.body,
            msg.legacyAmino.authInfo,
            extension,
          );
          posthog.capture('sign tx success', {
            chaidId: haqqChain.chainId,
          });

          return rawTx;
        } else {
          posthog.capture('sign tx failed', {
            chaidId: haqqChain.chainId,
          });
          throw new Error('No walletClient');
        }
      } else {
        posthog.capture('sign tx failed');
        throw new Error('No haqqChain');
      }
    },
    [haqqChain, posthog, walletClient],
  );

  const memoizedContext = useMemo<WalletProviderInterface>(() => {
    return {
      disconnect: disconnectAsync,
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
          ? Boolean(
              (window.ethereum as { isHaqqWallet?: boolean })?.isHaqqWallet,
            )
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
      supportedChains: availableChains,
      isChainSupported,
      connectors,
      availableConnectors,
      connectError,
      connect: connectAsync,
      setConnectError,
    };
  }, [
    disconnectAsync,
    handleNetworkChange,
    isNetworkSupported,
    setWalletSelectModalOpen,
    isWalletSelectModalOpen,
    setSelectChainModalOpen,
    isSelectChainModalOpen,
    handleWatchAsset,
    isLowBalanceAlertOpen,
    setLowBalanceAlertOpen,
    generatePubkey,
    getPubkey,
    signTransaction,
    availableChains,
    isChainSupported,
    connectors,
    availableConnectors,
    connectError,
    connectAsync,
    setConnectError,
  ]);

  useAutoconnect();

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
