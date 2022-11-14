import {
  createTxMsgDelegate,
  createTxMsgUndelegate,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxRawEIP712,
  signatureToWeb3Extension,
} from '@evmos/transactions';
import { useCallback, useMemo } from 'react';
import { useAddress } from '../hooks/useWallet';
import { useCosmosService } from './useCosmosService';
import type { Fee } from '@evmos/transactions';
import { getChainParams, mapToCosmosChain } from '../chains';
import { environment } from '../../environments/environment';

const fee: Fee = {
  amount: '5000',
  gas: '600000',
  denom: 'aISLM',
};

export function useDelegation() {
  const { broadcastTransaction, getAccountInfo, getPubkey } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const memo = '';

  const haqqChain = useMemo(() => {
    const chainParams = getChainParams(environment.chain);
    return mapToCosmosChain(chainParams);
  }, []);

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

  const handleDelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress) {
        const params = {
          validatorAddress,
          amount: ((amount ?? 0) * 10 ** 18).toLocaleString().replace(/,/g, ''),
          denom: 'aISLM',
        };
        const msg = createTxMsgDelegate(haqqChain, sender, fee, memo, params);
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

        const { tx_response } = await broadcastTransaction(rawTx);

        return tx_response.txhash;
      }
    },
    [getPubkey, ethAddress, getSender, haqqAddress, broadcastTransaction],
  );

  const handleUndelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress) {
        const params = {
          validatorAddress,
          amount: ((amount ?? 0) * 10 ** 18).toLocaleString().replace(/,/g, ''),
          denom: 'aISLM',
        };
        const msg = createTxMsgUndelegate(haqqChain, sender, fee, memo, params);
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

        const { tx_response } = await broadcastTransaction(rawTx);
        // console.log({ tx_response });

        return tx_response.txhash;
      }
    },
    [getPubkey, ethAddress, getSender, haqqAddress, broadcastTransaction],
  );

  const handleClaimAllRewards = useCallback(
    async (validatorAddresses: string[]) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender) {
        const params = {
          validatorAddresses,
        };

        const msg = createTxMsgMultipleWithdrawDelegatorReward(
          haqqChain,
          sender,
          fee,
          memo,
          params,
        );
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
    [broadcastTransaction, ethAddress, getPubkey, getSender, haqqAddress],
  );

  return {
    delegate: handleDelegate,
    undelegate: handleUndelegate,
    claimAllRewards: handleClaimAllRewards,
  };
}
