import {
  Sender,
  createTxMsgVote,
  createTxMsgDeposit,
  signatureToWeb3Extension,
  createTxRawEIP712,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import type {
  Fee,
  MessageMsgDepositParams,
  TxGenerated,
} from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import Decimal from 'decimal.js-light';
import { useNetwork, useWalletClient } from 'wagmi';

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

  const handleVote = useCallback(
    async (proposalId: number, option: number) => {
      console.log('handleVote', { proposalId, option });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Vote for proposal #${proposalId}`;

      if (sender && haqqChain) {
        // Simulate
        const simFee = getFee();
        const voteParams = {
          proposalId,
          option,
        };

        const simMsg = createTxMsgVote(
          haqqChain,
          sender,
          simFee,
          memo,
          voteParams,
        );
        const simTx = await signTransaction(simMsg, sender);
        const simulateTxResponse = await simulateTransaction(simTx);

        // Broadcast real transaction
        const fee = getFee(simulateTxResponse.gas_info.gas_used);
        const msg = createTxMsgVote(haqqChain, sender, fee, memo, voteParams);

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
      haqqChain,
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
      const memo = `Deposit to proposal #${proposalId}`;

      if (sender && haqqChain) {
        // Simulate
        const simFee = getFee();
        const simDepositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: getAmountAndDenom(amount, simFee),
        };

        const simMsg = createTxMsgDeposit(
          haqqChain,
          sender,
          simFee,
          memo,
          simDepositParams,
        );
        const simTx = await signTransaction(simMsg, sender);
        const simulateTxResponse = await simulateTransaction(simTx);

        // Broadcast real transaction
        const fee = getFee(simulateTxResponse.gas_info.gas_used);
        const depositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: getAmountAndDenom(amount, fee),
        };
        const msg = createTxMsgDeposit(
          haqqChain,
          sender,
          fee,
          memo,
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
      haqqChain,
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
