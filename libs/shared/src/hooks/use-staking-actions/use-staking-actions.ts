import {
  createTxMsgDelegate,
  createTxMsgUndelegate,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxRawEIP712,
  signatureToWeb3Extension,
  Sender,
  TxGenerated,
  createTxMsgWithdrawDelegatorReward,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import type { Fee } from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import Decimal from 'decimal.js-light';
import { useConfig } from '../../providers/config-provider';
import { useCosmosService } from '../../providers/cosmos-provider';
import { getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';

const FEE: Fee = {
  amount: '5000',
  gas: '14000000',
  denom: 'aISLM',
};

const WEI = 10 ** 18;

function getAmountAndDenom(amount: number, fee?: Fee) {
  let decAmount = new Decimal(amount).mul(WEI);

  if (fee) {
    decAmount = decAmount.sub(new Decimal(fee.amount));
  }

  return {
    amount: decAmount.toFixed(),
    denom: 'aISLM',
  };
}

export function useStakingActions() {
  const { chainName } = useConfig();
  const {
    broadcastTransaction,
    getAccountInfo,
    getPubkey,
    simulateTransaction,
  } = useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const memo = '';

  const haqqChain = useMemo(() => {
    const chainParams = getChainParams(chainName);
    return mapToCosmosChain(chainParams);
  }, [chainName]);

  const getSender = useCallback(
    async (address: string, pubkey: string) => {
      try {
        const accInfo = await getAccountInfo(address);

        return {
          accountAddress: address,
          sequence: parseInt(accInfo.sequence, 10),
          accountNumber: parseInt(accInfo.account_number, 10),
          pubkey,
        };
      } catch (error) {
        console.error((error as any).message);
        throw new Error((error as any).message);
      }
    },
    [getAccountInfo],
  );

  const getFee = useCallback((gasUsed?: string) => {
    return gasUsed && gasUsed !== ''
      ? {
          amount: `${(Number.parseInt(gasUsed, 10) * 0.007 * 1.1).toFixed()}`,
          gas: gasUsed,
          denom: 'aISLM',
        }
      : FEE;
  }, []);

  const signTransaction = useCallback(
    async (msg: TxGenerated, sender: Sender) => {
      const signature = await (window as any).ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [ethAddress, JSON.stringify(msg.eipToSign)],
      });
      const extension = signatureToWeb3Extension(haqqChain, sender, signature);
      const rawTx = createTxRawEIP712(
        msg.legacyAmino.body,
        msg.legacyAmino.authInfo,
        extension,
      );

      return rawTx;
    },
    [ethAddress, haqqChain],
  );

  const getDelegationParams = useCallback(
    (validatorAddress: string, amount: number, fee: Fee) => {
      return {
        validatorAddress,
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

      if (sender && validatorAddress) {
        // Simulate
        const simFee = getFee();
        const simParams = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          simFee,
        );
        const simMsg = createTxMsgDelegate(
          haqqChain,
          sender,
          simFee,
          memo,
          simParams,
        );
        const simTx = await signTransaction(simMsg, sender);
        const simulateTxResponse = await simulateTransaction(simTx);

        // Broadcast real transaction
        const fee = getFee(simulateTxResponse.gas_info.gas_used);
        const params = getDelegationParams(validatorAddress, amount ?? 0, fee);
        const msg = createTxMsgDelegate(haqqChain, sender, fee, memo, params);
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
      getFee,
      getDelegationParams,
      haqqChain,
      signTransaction,
      simulateTransaction,
      broadcastTransaction,
    ],
  );

  const handleUndelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress) {
        // Simulate
        const simFee = getFee();
        const simParams = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          simFee,
        );
        const simMsg = createTxMsgUndelegate(
          haqqChain,
          sender,
          simFee,
          memo,
          simParams,
        );
        const simTx = await signTransaction(simMsg, sender);
        const simulateTxResponse = await simulateTransaction(simTx);

        // Broadcast real transaction
        const fee = getFee(simulateTxResponse.gas_info.gas_used);
        const params = getDelegationParams(validatorAddress, amount ?? 0, fee);
        const msg = createTxMsgUndelegate(haqqChain, sender, fee, memo, params);
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
      getFee,
      getDelegationParams,
      haqqChain,
      signTransaction,
      simulateTransaction,
      broadcastTransaction,
    ],
  );

  const handleClaimAllRewards = useCallback(
    async (validatorAddresses: string[]) => {
      console.log('handleClaimAllRewards', { validatorAddresses });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender) {
        const params = {
          validatorAddresses,
        };

        const msg = createTxMsgMultipleWithdrawDelegatorReward(
          haqqChain,
          sender,
          FEE,
          memo,
          params,
        );
        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse.txhash;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      getPubkey,
      getSender,
      haqqAddress,
      haqqChain,
      signTransaction,
    ],
  );

  const handleClaimReward = useCallback(
    async (validatorAddress: string) => {
      console.log('handleClaimReward', { validatorAddress });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender) {
        const msg = createTxMsgWithdrawDelegatorReward(
          haqqChain,
          sender,
          FEE,
          memo,
          {
            validatorAddress,
          },
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse.txhash;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      getPubkey,
      getSender,
      haqqAddress,
      haqqChain,
      signTransaction,
    ],
  );

  return {
    delegate: handleDelegate,
    undelegate: handleUndelegate,
    claimAllRewards: handleClaimAllRewards,
    claimReward: handleClaimReward,
  };
}
