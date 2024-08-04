'use client';
import { useCallback, useMemo } from 'react';
// import { Fee } from '@evmos/transactions';
import { usePostHog } from 'posthog-js/react';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import {
  VESTING_DEFAULT_FEE,
  getChainParams,
  mapToCosmosChain,
} from '@haqq/data-access-cosmos';
import {
  MsgFundParams,
  MsgTransferOwnershipParams,
  createTxMsgFund,
  createTxMsgTransferOwnership,
} from './dao';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';

export function useDaoActions() {
  const { broadcastTransaction, getTransactionStatus, getSender } =
    useCosmosService();
  const { getPubkey, signTransaction, isNetworkSupported } = useWallet();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const chainParams = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const haqqChain = mapToCosmosChain(chainParams);
  const posthog = usePostHog();
  const chainId = chain.id;

  const getFundParams = useCallback(
    (depositor: string, amount: string, denom: string): MsgFundParams => {
      return {
        depositor,
        amount,
        denom,
      };
    },
    [],
  );

  const getTransferOwnershipParams = useCallback(
    (owner: string, newOwner: string): MsgTransferOwnershipParams => {
      return {
        owner,
        newOwner,
      };
    },
    [],
  );

  const handleFund = useCallback(
    async (amount: string, denom: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = '';

      if (sender && haqqChain && haqqAddress) {
        const params = getFundParams(haqqAddress, amount, denom);

        const msg = createTxMsgFund(
          haqqChain,
          sender,
          VESTING_DEFAULT_FEE,
          memo,
          params,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await trackBroadcastTx(
          broadcastTransaction(rawTx),
          chainId,
          posthog,
        );

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
      } else {
        throw new Error('No sender or haqqChain');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFundParams,
      signTransaction,
      broadcastTransaction,
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  const handleTransfer = useCallback(
    async (newOwner: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = '';

      if (sender && haqqChain && haqqAddress) {
        const params = getTransferOwnershipParams(haqqAddress, newOwner);

        const msg = createTxMsgTransferOwnership(
          haqqChain,
          sender,
          VESTING_DEFAULT_FEE,
          memo,
          params,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await trackBroadcastTx(
          broadcastTransaction(rawTx),
          chainId,
          posthog,
        );

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
      } else {
        throw new Error('No sender or haqqChain');
      }
    },
    [
      broadcastTransaction,
      chainId,
      ethAddress,
      getPubkey,
      getSender,
      getTransactionStatus,
      getTransferOwnershipParams,
      haqqAddress,
      haqqChain,
      posthog,
      signTransaction,
    ],
  );

  return useMemo(() => {
    return {
      fund: handleFund,
      transfer: handleTransfer,
    };
  }, [handleFund, handleTransfer]);
}
