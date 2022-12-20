import {
  createTxMsgVote,
  createTxRawEIP712,
  MessageMsgVote,
  signatureToWeb3Extension,
  MessageMsgDepositParams,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import type { Fee } from '@evmos/transactions';
import { useCosmosService, useConfig } from '@haqq/providers';
import { getChainParams, mapToCosmosChain } from '@haqq/shared';
import { useAddress } from '../use-address/use-address';
import Decimal from 'decimal.js-light';
import { createTxMsgDeposit } from './createTxMsgDeposit';

const fee: Fee = {
  amount: '5000',
  gas: '600000',
  denom: 'aISLM',
};

interface ProposalHook {
  vote: (proposalId: number, option: number) => Promise<string>;
  deposit: (proposalId: number, amount: number) => Promise<string>;
}

export function useProposal(): ProposalHook {
  const { chainName } = useConfig();
  const { broadcastTransaction, getAccountInfo, getPubkey } =
    useCosmosService();
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

  const handleVote = useCallback(
    async (proposalId: number, option: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender) {
        const voteParams: MessageMsgVote = {
          proposalId,
          option,
        };

        const msg = createTxMsgVote(haqqChain, sender, fee, memo, voteParams);

        const signature = await (window as any).ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [ethAddress, JSON.stringify(msg.eipToSign)],
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

        // console.debug({
        //   params,
        //   msg,
        //   signature,
        //   extension,
        //   rawTx,
        // });

        const tx = await broadcastTransaction(rawTx);

        return tx.txhash;
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      getPubkey,
      getSender,
      haqqAddress,
      haqqChain,
    ],
  );

  const handleDeposit = useCallback(
    async (proposalId: number, amount: number) => {
      console.log('handleDeposit', { proposalId, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender) {
        const depositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: {
            amount: new Decimal(amount).mul(10 ** 18).toFixed(),
            denom: 'aISLM',
          },
        };

        const msg = createTxMsgDeposit(
          haqqChain,
          sender,
          fee,
          memo,
          depositParams,
        );

        const signature = await (window as any).ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [ethAddress, JSON.stringify(msg.eipToSign)],
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

        console.debug({
          depositParams,
          msg,
          signature,
          extension,
          rawTx,
        });

        const tx = await broadcastTransaction(rawTx);
        console.log({ tx });

        return tx.txhash;
      }
      return '';
    },
    [
      broadcastTransaction,
      ethAddress,
      getPubkey,
      getSender,
      haqqAddress,
      haqqChain,
    ],
  );

  return {
    vote: handleVote,
    deposit: handleDeposit,
  };
}
