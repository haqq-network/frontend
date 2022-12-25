import {
  createTxMsgVote,
  createTxRawEIP712,
  MessageMsgVote,
  signatureToWeb3Extension,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import type { Fee } from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useConfig } from '../../providers/config-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';

const fee: Fee = {
  amount: '5000',
  gas: '600000',
  denom: 'aISLM',
};

type ProposalVoteHook = (proposalId: number, option: number) => Promise<string>;

export function useProposalVote(): ProposalVoteHook {
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
        // console.log({ msg });

        const signature = await (window as any).ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [ethAddress, JSON.stringify(msg.eipToSign)],
        });
        // console.log({ signature });
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

  return handleVote;
}
