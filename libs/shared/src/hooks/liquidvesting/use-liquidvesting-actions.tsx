'use client';
import { useCallback, useMemo } from 'react';
import { Fee } from '@evmos/transactions';
import { usePostHog } from 'posthog-js/react';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { VESTING_DEFAULT_FEE, getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import {
  MsgLiquidateParams,
  createTxMsgLiquidate,
  createTxMsgRedeem,
  MsgRedeemParams,
} from './liquidvesting';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';

export function useLiquidVestingActions() {
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

  const getLiquidateParams = useCallback(
    (
      liquidateTo: string,
      amount: number,
      balance: number,
      fee: Fee,
    ): MsgLiquidateParams => {
      return {
        liquidateTo,
        ...getAmountIncludeFee(amount, balance, fee),
      };
    },
    [],
  );

  const getRedeemParams = useCallback(
    (redeemTo: string, amount: string, denom: string): MsgRedeemParams => {
      return {
        redeemTo,
        amount,
        denom,
      };
    },
    [],
  );

  const handleLiquidate = useCallback(
    async (address?: string, amount?: number, balance?: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = '';

      if (sender && address && haqqChain) {
        const params = getLiquidateParams(
          address,
          amount ?? 0,
          balance ?? 0,
          VESTING_DEFAULT_FEE,
        );

        const msg = createTxMsgLiquidate(
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
        throw new Error('No sender or Validator address');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getLiquidateParams,
      signTransaction,
      posthog,
      chainId,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleRedeem = useCallback(
    async (address: string, amount: string, denom: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = '';

      if (sender && address && haqqChain) {
        const params = getRedeemParams(address, amount, denom);

        const msg = createTxMsgRedeem(
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
        throw new Error('No sender or Validator address');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getRedeemParams,
      signTransaction,
      broadcastTransaction,
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  return useMemo(() => {
    return {
      liquidate: handleLiquidate,
      redeem: handleRedeem,
    };
  }, [handleLiquidate, handleRedeem]);
}
