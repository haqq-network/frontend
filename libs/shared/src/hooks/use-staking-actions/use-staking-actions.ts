import { useCallback } from 'react';
import {
  createMsgBeginRedelegate,
  createMsgDelegate,
  createMsgUndelegate,
  createMsgWithdrawDelegatorReward,
} from '@evmos/proto';
import {
  createTxMsgDelegate,
  createTxMsgUndelegate,
  Sender,
  createTxMsgWithdrawDelegatorReward,
  TxGenerated,
  createTxRawEIP712,
  signatureToWeb3Extension,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxMsgBeginRedelegate,
  MsgBeginRedelegateParams,
} from '@evmos/transactions';
import type { Fee, MsgDelegateParams } from '@evmos/transactions';
import { useNetwork, useWalletClient } from 'wagmi';
import { getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { EstimatedFeeResponse } from '../../utils/get-estimated-fee';
import { useAddress } from '../use-address/use-address';

export function useStakingActions() {
  const {
    broadcastTransaction,
    getPubkey,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const { data: walletClient } = useWalletClient();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);

  const signTransaction = useCallback(
    async (msg: TxGenerated, sender: Sender) => {
      if (haqqChain && ethAddress && walletClient) {
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
    [ethAddress, haqqChain, walletClient],
  );

  const getDelegationParams = useCallback(
    (
      validatorAddress: string,
      amount: number,
      balance: number,
      fee: Fee,
    ): MsgDelegateParams => {
      const amountIncludeFee = getAmountIncludeFee(amount, balance, fee);

      return {
        validatorAddress,
        ...amountIncludeFee,
      };
    },
    [],
  );

  const getRedelegationParams = useCallback(
    (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      balance: number,
      fee: Fee,
    ): MsgBeginRedelegateParams => {
      return {
        validatorSrcAddress: validatorSourceAddress,
        validatorDstAddress: validatorDestinationAddress,
        ...getAmountIncludeFee(amount, balance, fee),
      };
    },
    [],
  );

  const handleDelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: number,
      balance?: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Delegate ${Number.parseFloat((amount ?? 0).toString())} ISLM to ${validatorAddress}`;

      if (sender && validatorAddress && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          balance ?? 0,
          fee,
        );
        const msg = createTxMsgDelegate(haqqChain, sender, fee, memo, params);

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
      getFee,
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleUndelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: number,
      balance?: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Undelegate ${Number.parseFloat((amount ?? 0).toString())} ISLM from ${validatorAddress}`;

      if (sender && validatorAddress && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          balance ?? 0,
          fee,
        );
        const msg = createTxMsgUndelegate(haqqChain, sender, fee, memo, params);
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
      getFee,
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleClaimAllRewards = useCallback(
    async (
      validatorAddresses: string[],
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Claim rewards from ${validatorAddresses.length} validators`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = {
          validatorAddresses,
        };
        const msg = createTxMsgMultipleWithdrawDelegatorReward(
          haqqChain,
          sender,
          fee,
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
        throw new Error('No sender');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleClaimReward = useCallback(
    async (validatorAddress: string, estimatedFee?: EstimatedFeeResponse) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Claim reward from ${validatorAddress}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = {
          validatorAddress,
        };
        const msg = createTxMsgWithdrawDelegatorReward(
          haqqChain,
          sender,
          fee,
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
        throw new Error('No sender');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      balance?: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Redelegate from ${validatorSourceAddress} to ${validatorDestinationAddress}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = getRedelegationParams(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount ?? 0,
          balance ?? 0,
          fee,
        );
        const msg = createTxMsgBeginRedelegate(
          haqqChain,
          sender,
          fee,
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
      getFee,
      getRedelegationParams,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleDelegateEstimatedFee = useCallback(
    async (validatorAddress: string, amount: number) => {
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      const protoMsg = createMsgDelegate(
        haqqAddress as string,
        validatorAddress,
        bigIntAmount.toString(),
        'aISLM',
      );
      const memo = `Delegate ${Number.parseFloat(bigIntAmount.toString())} ISLM to ${validatorAddress}`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [getEstimatedFee, haqqAddress, haqqChain.cosmosChainId],
  );

  const handleUndelegateEstimatedFee = useCallback(
    async (validatorAddress: string, amount: number) => {
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      const protoMsg = createMsgUndelegate(
        haqqAddress as string,
        validatorAddress,
        bigIntAmount.toString(),
        'aISLM',
      );
      const memo = `Undelegate ${Number.parseFloat(bigIntAmount.toString())} ISLM from ${validatorAddress}`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [getEstimatedFee, haqqAddress, haqqChain.cosmosChainId],
  );

  const handleRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
    ) => {
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      const protoMsg = createMsgBeginRedelegate(
        haqqAddress as string,
        validatorSourceAddress,
        validatorDestinationAddress,
        bigIntAmount.toString(),
        'aISLM',
      );
      const memo = `Redelegate from ${validatorSourceAddress} to ${validatorDestinationAddress}`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [getEstimatedFee, haqqAddress, haqqChain.cosmosChainId],
  );

  const handleGetRewardEstimatedFee = useCallback(
    async (validatorAddress: string) => {
      const protoMsg = createMsgWithdrawDelegatorReward(
        haqqAddress as string,
        validatorAddress,
      );
      const memo = `Claim reward from ${validatorAddress}`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [getEstimatedFee, haqqAddress, haqqChain.cosmosChainId],
  );

  const handleGetAllRewardEstimatedFee = useCallback(
    async (validatorAddresses: string[]) => {
      const protoMsgs = validatorAddresses.map((validatorAddress) => {
        return createMsgWithdrawDelegatorReward(
          haqqAddress as string,
          validatorAddress,
        );
      });
      const memo = `Claim rewards from ${validatorAddresses.length} validators`;

      return await getEstimatedFee(
        protoMsgs,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [getEstimatedFee, haqqAddress, haqqChain.cosmosChainId],
  );

  return {
    delegate: handleDelegate,
    undelegate: handleUndelegate,
    redelegate: handleRedelegate,
    claimReward: handleClaimReward,
    claimAllRewards: handleClaimAllRewards,
    getDelegateEstimatedFee: handleDelegateEstimatedFee,
    getUndelegateEstimatedFee: handleUndelegateEstimatedFee,
    getRedelegateEstimatedFee: handleRedelegateEstimatedFee,
    getClaimRewardEstimatedFee: handleGetRewardEstimatedFee,
    getClaimAllRewardEstimatedFee: handleGetAllRewardEstimatedFee,
  };
}
