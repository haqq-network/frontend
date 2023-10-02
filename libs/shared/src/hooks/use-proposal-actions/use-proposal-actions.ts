import {
  Sender,
  createTxMsgVote,
  createTxMsgDeposit,
  signatureToWeb3Extension,
  createTxRawEIP712,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import { createMsgVote, createMsgDeposit } from '@evmos/eip712';
import type {
  MessageMsgDepositParams,
  TxGenerated,
  MessageMsgVote,
} from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useFeeData, useNetwork, useWalletClient } from 'wagmi';
import { getAmount } from '../../utils/get-amount';

export function useProposalActions() {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { broadcastTransaction, getSender, getPubkey, getFee } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const { data: feeData } = useFeeData({ watch: true });

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

  const handleVote = useCallback(
    async (proposalId: number, option: number) => {
      console.log('handleVote', { proposalId, option });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Vote for proposal #${proposalId}`;

      if (sender && haqqChain && feeData) {
        const voteParams: MessageMsgVote = {
          proposalId,
          option,
        };

        const fee = await getFee(
          {
            '@type': '/cosmos.gov.v1beta1.MsgVote',
            ...createMsgVote(
              voteParams.proposalId,
              voteParams.option,
              sender.accountAddress,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
        );
        const msg = createTxMsgVote(haqqChain, sender, fee, memo, voteParams);

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

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

  const handleDeposit = useCallback(
    async (proposalId: number, amount: number) => {
      console.log('handleDeposit', { proposalId, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Deposit to proposal #${proposalId}`;

      if (sender && haqqChain && feeData) {
        const depositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: {
            amount: getAmount(amount),
            denom: 'aISLM',
          },
        };

        const fee = await getFee(
          {
            '@type': '/cosmos.gov.v1beta1.MsgDeposit',
            ...createMsgDeposit(
              depositParams.proposalId,
              sender.accountAddress,
              depositParams.deposit,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
        );
        const msg = createTxMsgDeposit(
          haqqChain,
          sender,
          fee,
          memo,
          depositParams,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

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

  return {
    vote: handleVote,
    deposit: handleDeposit,
  };
}
