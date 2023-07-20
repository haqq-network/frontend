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
import { DEFAULT_FEE, getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import Decimal from 'decimal.js-light';
import { useNetwork, useWalletClient } from 'wagmi';

interface ProposalActionsHook {
  vote: (proposalId: number, option: number) => Promise<string>;
  deposit: (proposalId: number, amount: number) => Promise<string>;
}

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

export function useProposalActions(): ProposalActionsHook {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { broadcastTransaction, getAccountInfo, getPubkey } =
    useCosmosService();
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
        console.error((error as Error).message);
        throw error;
      }
    },
    [getAccountInfo],
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

  const handleVote = useCallback(
    async (proposalId: number, option: number) => {
      console.log('handleVote', { proposalId, option });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Vote for proposal #${proposalId}`;

      if (sender && haqqChain) {
        const voteParams = {
          proposalId,
          option,
        };

        const msg = createTxMsgVote(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
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
      haqqChain,
      signTransaction,
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
        const depositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: getAmountAndDenom(amount, DEFAULT_FEE),
        };
        const msg = createTxMsgDeposit(
          haqqChain,
          sender,
          DEFAULT_FEE,
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
      haqqChain,
      getPubkey,
      getSender,
      haqqAddress,
      signTransaction,
    ],
  );

  return {
    vote: handleVote,
    deposit: handleDeposit,
  };
}
