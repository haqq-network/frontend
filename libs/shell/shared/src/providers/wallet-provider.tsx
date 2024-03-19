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
import store from 'store2';
import type { Hex } from 'viem';
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
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);

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
      walletClient?.request({
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
    },
    [walletClient],
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

  const getPubkey = useCallback(
    async (address: string) => {
      const storeKey = `pubkey_${address}`;
      const savedPubKey: string | null = store.get(storeKey);
      console.log('getPubkey', { storeKey, savedPubKey });

      if (!savedPubKey) {
        try {
          let pubkey: string | undefined;
          const haqqAddress = ethToHaqq(address);
          pubkey = await getPubkeyFromChain(haqqAddress);

          if (!pubkey) {
            pubkey = await generatePubkey(address);
          }

          store.set(storeKey, pubkey);
          return pubkey;
        } catch (error) {
          console.error((error as Error).message);
          throw error;
        }
      }

      return savedPubKey;
    },
    [generatePubkey, getPubkeyFromChain],
  );

  const signTransaction = useCallback(
    async (msg: TxGenerated, sender: Sender) => {
      if (haqqChain && walletClient) {
        const ethAddress = haqqToEth(sender.accountAddress);
        const signature = await walletClient.request({
          method: 'eth_signTypedData_v4',
          params: [ethAddress as `0x${string}`, JSON.stringify(msg.eipToSign)],
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

        return rawTx;
      } else {
        throw new Error('No haqqChain');
      }
    },
    [haqqChain, walletClient],
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
