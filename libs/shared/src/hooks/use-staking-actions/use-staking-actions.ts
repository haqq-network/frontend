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
import { useCallback, useMemo } from 'react';
import type { Fee, MsgDelegateParams } from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import Decimal from 'decimal.js-light';
import { useCosmosService } from '../../providers/cosmos-provider';
import { DEFAULT_FEE, getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useNetwork, useWalletClient } from 'wagmi';

function getAmountAndDenom(amount: number, fee?: Fee) {
  let decAmount = new Decimal(amount).mul(10 ** 18);

  if (fee) {
    decAmount = decAmount.sub(new Decimal(fee.amount));
  }

  return {
    amount: decAmount.toFixed(),
    denom: 'aISLM',
  };
}

export function useStakingActions() {
  const { broadcastTransaction, getAccountBaseInfo, getPubkey } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();

  const haqqChain = useMemo(() => {
    if (!chain || chain.unsupported) {
      return undefined;
    }

    const chainParams = getChainParams(chain.id);
    return mapToCosmosChain(chainParams);
  }, [chain]);

  const getSender = useCallback(
    async (address: string, pubkey: string) => {
      try {
        const accInfo = await getAccountBaseInfo(address);

        if (!accInfo) {
          throw new Error('no base account info');
        }

        return {
          accountAddress: address,
          sequence: parseInt(accInfo.sequence, 10),
          accountNumber: parseInt(accInfo.account_number, 10),
          pubkey,
        };
      } catch (error) {
        console.error((error as Error).message);
        throw error;
      }
    },
    [getAccountBaseInfo],
  );

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
    (validatorAddress: string, amount: number, fee: Fee): MsgDelegateParams => {
      return {
        validatorAddress,
        ...getAmountAndDenom(amount, fee),
      };
    },
    [],
  );

  const getRedelegationParams = useCallback(
    (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      fee: Fee,
    ): MsgBeginRedelegateParams => {
      return {
        validatorSrcAddress: validatorSourceAddress,
        validatorDstAddress: validatorDestinationAddress,
        ...getAmountAndDenom(amount, fee),
      };
    },
    [],
  );

  const handleDelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      console.log('handleDelegate', { validatorAddress, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = 'Delegate';

      if (sender && validatorAddress && haqqChain) {
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          DEFAULT_FEE,
        );
        const msg = createTxMsgDelegate(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          params,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse;
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
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
    ],
  );

  const handleUndelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      console.log('handleUndelegate', { validatorAddress, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = 'Undelegate';

      if (sender && validatorAddress && haqqChain) {
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          DEFAULT_FEE,
        );
        const msg = createTxMsgUndelegate(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          params,
        );
        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse;
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
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
    ],
  );

  const handleClaimAllRewards = useCallback(
    async (validatorAddresses: string[]) => {
      console.log('handleClaimReward', { validatorAddresses });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = 'Claim all rewards';

      if (sender && haqqChain) {
        const params = {
          validatorAddresses,
        };
        const msg = createTxMsgMultipleWithdrawDelegatorReward(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          params,
        );
        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      haqqChain,
      getPubkey,
      getSender,
      haqqAddress,
      signTransaction,
    ],
  );

  const handleClaimReward = useCallback(
    async (validatorAddress: string) => {
      console.log('handleClaimReward', { validatorAddress });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = 'Claim reward';

      if (sender && haqqChain) {
        const params = {
          validatorAddress,
        };
        const msg = createTxMsgWithdrawDelegatorReward(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          params,
        );
        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      haqqChain,
      getPubkey,
      getSender,
      haqqAddress,
      signTransaction,
    ],
  );

  const handleRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
    ) => {
      console.log('handleRedelegate', {
        validatorSourceAddress,
        validatorDestinationAddress,
      });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Redelegate from ${validatorSourceAddress} to ${validatorDestinationAddress}`;

      if (sender && haqqChain) {
        const params = getRedelegationParams(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount ?? 0,
          DEFAULT_FEE,
        );
        const msg = createTxMsgBeginRedelegate(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          params,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse;
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
      getRedelegationParams,
      signTransaction,
      broadcastTransaction,
    ],
  );

  return {
    delegate: handleDelegate,
    undelegate: handleUndelegate,
    claimAllRewards: handleClaimAllRewards,
    claimReward: handleClaimReward,
    redelegate: handleRedelegate,
  };
}
