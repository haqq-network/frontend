import { useCallback, useMemo } from 'react';
import {
  Sender,
  TxGenerated,
  createTxRawEIP712,
  Fee,
  signatureToWeb3Extension,
} from '@evmos/transactions';
import { type Hex } from 'viem';
import { useNetwork, useWalletClient } from 'wagmi';
import {
  MsgLiquidateParams,
  createTxMsgLiquidate,
  createTxMsgRedeem,
  MsgRedeemParams,
} from './liquidvesting';
import {
  VESTING_DEFAULT_FEE,
  getChainParams,
} from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { useAddress } from '../use-address/use-address';

export function useLiquidVestingActions() {
  const { broadcastTransaction, getPubkey, getTransactionStatus, getSender } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);
  const { data: walletClient } = useWalletClient();

  const signTransaction = useCallback(
    async (msg: TxGenerated, sender: Sender) => {
      if (haqqChain && ethAddress && walletClient) {
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

        return rawTx;
      } else {
        throw new Error('No haqqChain');
      }
    },
    [ethAddress, haqqChain, walletClient],
  );

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
    (
      redeemTo: string,
      amount: number,
      balance: number,
      fee: Fee,
    ): MsgRedeemParams => {
      return {
        redeemTo,
        ...getAmountIncludeFee(amount, balance, fee),
      };
    },
    [],
  );

  const handleLiquidate = useCallback(
    async (address?: string, amount?: number, balance?: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = 'Convert to liquid token';

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
        const txResponse = await broadcastTransaction(rawTx);

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
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleRedeem = useCallback(
    async (address?: string, amount?: number, balance?: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = 'Redeem liquid token';

      if (sender && address && haqqChain) {
        const params = getRedeemParams(
          address,
          amount ?? 0,
          balance ?? 0,
          VESTING_DEFAULT_FEE,
        );

        const msg = createTxMsgRedeem(
          haqqChain,
          sender,
          VESTING_DEFAULT_FEE,
          memo,
          params,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

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
