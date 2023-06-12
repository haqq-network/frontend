import {
  createTxMsgVote,
  // createTxMsgDeposit,
  TxPayload,
  Sender,
  createTxMsgDeposit,
} from '@evmos/transactions';
import { useCallback } from 'react';
import type { Fee, MsgDepositParams } from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import Decimal from 'decimal.js-light';
import { useNetwork, useWalletClient } from 'wagmi';
import { createTxRaw } from '@evmos/proto';

const FEE: Fee = {
  amount: '5000',
  gas: '600000',
  denom: 'aISLM',
};

interface ProposalActionsHook {
  vote: (proposalId: number, option: number) => Promise<string>;
  deposit: (proposalId: number, amount: number) => Promise<string>;
}

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

export function useProposalActions(): ProposalActionsHook {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const {
    broadcastTransaction,
    simulateTransaction,
    getAccountInfo,
    getPubkey,
  } = useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const memo = '';

  const getHaqqChain = useCallback(async () => {
    if (!chain) {
      return undefined;
    }

    const chainParams = getChainParams(chain.id);
    return mapToCosmosChain(chainParams);
  }, [chain]);

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
    async (msg: TxPayload, sender: Sender) => {
      const haqqChain = await getHaqqChain();

      if (haqqChain && walletClient) {
        const { signDirect, eipToSign } = msg;
        const signature: string = await walletClient.request({
          method: 'eth_signTypedData_v4',
          params: [sender, JSON.stringify(eipToSign)],
        } as any);
        const signatureBytes = Buffer.from(signature.replace('0x', ''), 'hex');

        const bodyBytes = signDirect.body.toBinary();
        const authInfoBytes = signDirect.authInfo.toBinary();

        const signedTx = createTxRaw(bodyBytes, authInfoBytes, [
          signatureBytes,
        ]);

        return signedTx;
      } else {
        throw new Error('No haqqChain');
      }
    },
    [getHaqqChain, walletClient],
  );

  const handleVote = useCallback(
    async (proposalId: number, option: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const haqqChain = await getHaqqChain();

      if (sender && haqqChain) {
        // Simulate
        const simFee = getFee();
        const voteParams = {
          proposalId,
          option,
        };

        const simMsg = createTxMsgVote(
          { chain: haqqChain, fee: simFee, memo, sender },
          voteParams,
        );
        const simTx = await signTransaction(simMsg, sender);
        const simulateTxResponse = await simulateTransaction(simTx);

        // Broadcast real transaction
        const fee = getFee(simulateTxResponse.gas_info.gas_used);
        const msg = createTxMsgVote(
          { chain: haqqChain, fee, memo, sender },
          voteParams,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse.txhash;
      } else {
        throw new Error('No sender');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      getHaqqChain,
      getFee,
      signTransaction,
      simulateTransaction,
      broadcastTransaction,
    ],
  );

  const handleDeposit = useCallback(
    async (proposalId: number, amount: number) => {
      console.log('handleDeposit', { proposalId, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const haqqChain = await getHaqqChain();

      if (sender && haqqChain) {
        // Simulate
        const simFee = getFee();
        const simDepositParams: MsgDepositParams = {
          proposalId,
          deposit: getAmountAndDenom(amount, simFee),
        };

        const simMsg = createTxMsgDeposit(
          { chain: haqqChain, fee: simFee, memo, sender },
          simDepositParams,
        );
        const simTx = await signTransaction(simMsg, sender);
        const simulateTxResponse = await simulateTransaction(simTx);

        // Broadcast real transaction
        const fee = getFee(simulateTxResponse.gas_info.gas_used);
        const depositParams: MsgDepositParams = {
          proposalId,
          deposit: getAmountAndDenom(amount, fee),
        };
        const msg = createTxMsgDeposit(
          { chain: haqqChain, fee, memo, sender },
          depositParams,
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
      getFee,
      getHaqqChain,
      getPubkey,
      getSender,
      haqqAddress,
      signTransaction,
      simulateTransaction,
    ],
  );

  return {
    vote: handleVote,
    deposit: handleDeposit,
  };
}
