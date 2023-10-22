import {
  createTxMsgDelegate,
  createTxMsgUndelegate,
  createTxMsgWithdrawDelegatorReward,
  createTxRawEIP712,
  signatureToWeb3Extension,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxMsgBeginRedelegate,
} from '@evmos/transactions';
import {
  createMsgDelegate,
  createMsgUndelegate,
  createMsgWithdrawDelegatorReward,
  createMsgBeginRedelegate,
} from '@evmos/eip712';
import { useCallback, useMemo } from 'react';
import type {
  MsgBeginRedelegateParams,
  MsgDelegateParams,
  MsgMultipleWithdrawDelegatorRewardParams,
  MsgUndelegateParams,
  Sender,
  TxGenerated,
} from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { useCosmosService } from '../../providers/cosmos-provider';
import { getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useFeeData, useNetwork, useWalletClient } from 'wagmi';
import { getAmount } from '../../utils/get-amount';

export function useStakingActions() {
  const { broadcastTransaction, getPubkey, getFee, getSender } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const { data: walletClient } = useWalletClient();
  const { data: feeData } = useFeeData();
  const { chain } = useNetwork();

  const haqqChain = useMemo(() => {
    if (!chain || chain.unsupported) {
      return undefined;
    }

    const chainParams = getChainParams(chain.id);
    return mapToCosmosChain(chainParams);
  }, [chain]);

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

  const getStakingFee = useCallback(
    async (validatorAddress: string, amount: number, denom: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (!feeData) {
        return null;
      }

      return await getFee(
        {
          '@type': '/cosmos.staking.v1beta1.MsgDelegate',
          ...createMsgDelegate(
            sender.accountAddress,
            validatorAddress,
            getAmount(amount),
            denom,
          ).value,
        },
        sender,
        Number(feeData.gasPrice),
      );
    },
    [ethAddress, feeData, getFee, getPubkey, getSender, haqqAddress],
  );

  const handleDelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      console.log('handleDelegate', { validatorAddress, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Delegate to ${validatorAddress}`;

      if (sender && amount && validatorAddress && haqqChain) {
        const params: MsgDelegateParams = {
          validatorAddress,
          amount: getAmount(amount),
          denom: 'aISLM',
        };
        const fee = await getStakingFee(
          params.validatorAddress,
          amount,
          params.denom,
        );
        if (!fee) {
          throw new Error('no fee data');
        }
        // const fee = await getFee(
        //   {
        //     '@type': '/cosmos.staking.v1beta1.MsgDelegate',
        //     ...createMsgDelegate(
        //       sender.accountAddress,
        //       params.validatorAddress,
        //       params.amount,
        //       params.denom,
        //     ).value,
        //   },
        //   sender,
        //   Number(feeData.gasPrice),
        // );
        const msg = createTxMsgDelegate(haqqChain, sender, fee, memo, params);
        console.log({ msg });

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

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
      getStakingFee,
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

      if (sender && amount && validatorAddress && haqqChain && feeData) {
        const params: MsgUndelegateParams = {
          validatorAddress,
          amount: getAmount(amount),
          denom: 'aISLM',
        };
        const fee = await getFee(
          {
            '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
            ...createMsgUndelegate(
              sender.accountAddress,
              params.validatorAddress,
              params.amount,
              params.denom,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
        );
        const msg = createTxMsgUndelegate(haqqChain, sender, fee, memo, params);

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

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
      feeData,
      getFee,
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

      if (sender && haqqChain && feeData) {
        const params: MsgMultipleWithdrawDelegatorRewardParams = {
          validatorAddresses,
        };
        const fee = await getFee(
          validatorAddresses.map((address) => {
            return {
              '@type':
                '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
              ...createMsgWithdrawDelegatorReward(
                sender.accountAddress,
                address,
              ).value,
            };
          }),
          sender,
          Number(feeData.gasPrice),
        );
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

        return txResponse;
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
      feeData,
      getFee,
      signTransaction,
      broadcastTransaction,
    ],
  );

  const handleClaimReward = useCallback(
    async (validatorAddress: string) => {
      console.log('handleClaimReward', { validatorAddress });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Claim rewards from ${validatorAddress}`;

      if (sender && haqqChain && feeData) {
        const params = {
          validatorAddress,
        };
        const fee = await getFee(
          {
            '@type': '/cosmos.staking.v1beta1.MsgWithdrawDelegationReward',
            ...createMsgWithdrawDelegatorReward(
              sender.accountAddress,
              params.validatorAddress,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
        );
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

        return txResponse;
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
      feeData,
      getFee,
      signTransaction,
      broadcastTransaction,
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

      if (sender && haqqChain && feeData) {
        const params: MsgBeginRedelegateParams = {
          validatorSrcAddress: validatorSourceAddress,
          validatorDstAddress: validatorDestinationAddress,
          amount: getAmount(amount),
          denom: 'aISLM',
        };
        const fee = await getFee(
          {
            '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
            ...createMsgBeginRedelegate(
              sender.accountAddress,
              params.validatorSrcAddress,
              params.validatorDstAddress,
              params.amount,
              params.denom,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
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
      feeData,
      getFee,
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
    getStakingFee,
  };
}
