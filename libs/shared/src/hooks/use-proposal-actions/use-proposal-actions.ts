import {
  createTxMsgVote,
  createTxRawEIP712,
  MessageMsgVote,
  signatureToWeb3Extension,
  MessageMsgDepositParams,
  createTxMsgDeposit,
  // MessageMsgSubmitProposal,
  // createTxMsgSubmitProposal,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import type { Fee } from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useConfig } from '../../providers/config-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import Decimal from 'decimal.js-light';
// import { cosmos } from '@evmos/proto/dist/proto/cosmos/gov/v1beta1/gov';

// const TextProposal = cosmos.gov.v1beta1.TextProposal;
// const textPro = TextProposal.fromObject({
//   title: 'SUBMIT PROPOSAL TEST',
//   description: 'Lorem ipsum',
// });

// console.log({ textPro });

const fee: Fee = {
  amount: '5000',
  gas: '600000',
  denom: 'aISLM',
};

interface ProposalActionsHook {
  vote: (proposalId: number, option: number) => Promise<string>;
  deposit: (proposalId: number, amount: number) => Promise<string>;
  // createProposal: () => Promise<string>;
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
          deposit: getAmountAndDenom(amount, fee),
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
    ],
  );

  // const handleCreateProposal = useCallback(async () => {
  //   const pubkey = await getPubkey(ethAddress as string);
  //   const sender = await getSender(haqqAddress as string, pubkey);

  //   try {
  //     if (sender) {
  //       const depositParams: MessageMsgSubmitProposal = {
  //         initialDepositAmount: new Decimal(100).mul(10 ** 18).toFixed(),
  //         initialDepositDenom: 'aISLM',
  //         proposer: sender.accountAddress,
  //         content: textPro,
  //       };

  //       const msg = createTxMsgSubmitProposal(
  //         haqqChain,
  //         sender,
  //         fee,
  //         memo,
  //         depositParams,
  //       );

  //       const signature = await (window as any).ethereum.request({
  //         method: 'eth_signTypedData_v4',
  //         params: [ethAddress, JSON.stringify(msg.eipToSign)],
  //       });

  //       const extension = signatureToWeb3Extension(
  //         haqqChain,
  //         sender,
  //         signature,
  //       );
  //       const rawTx = createTxRawEIP712(
  //         msg.legacyAmino.body,
  //         msg.legacyAmino.authInfo,
  //         extension,
  //       );

  //       console.debug({
  //         depositParams,
  //         msg,
  //         signature,
  //         extension,
  //         rawTx,
  //       });

  //       const tx = await broadcastTransaction(rawTx);
  //       console.log({ tx });

  //       return tx.txhash;
  //     }
  //   } catch (error) {
  //     console.error({ error });
  //   }
  //   return '';
  // }, [
  //   broadcastTransaction,
  //   ethAddress,
  //   getPubkey,
  //   getSender,
  //   haqqAddress,
  //   haqqChain,
  // ]);

  return {
    vote: handleVote,
    deposit: handleDeposit,
    // createProposal: handleCreateProposal,
  };
}
