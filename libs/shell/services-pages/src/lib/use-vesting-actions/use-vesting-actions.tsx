import { useCallback, useMemo } from 'react';
import { MessageMsgCreateClawbackVestingAccount } from '@evmos/transactions';
import {
  useAddress,
  getChainParams,
  useCosmosService,
  mapToCosmosChain,
} from '@haqq/shared';
import { useNetwork } from 'wagmi';

export function useVestingActions() {
  const { chain } = useNetwork();
  // const { data: walletClient } = useWalletClient();
  const { getAccountBaseInfo, getPubkey } = useCosmosService();
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
        const accInfo = await getAccountBaseInfo(address);

        if (!accInfo) {
          throw new Error('no base account info');
        }

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
    [getAccountBaseInfo],
  );

  // const signTransaction = useCallback(
  //   async (msg: TxGenerated, sender: Sender) => {
  //     if (haqqChain && ethAddress && walletClient) {
  //       const signature = await walletClient.request({
  //         method: 'eth_signTypedData_v4',
  //         params: [ethAddress as `0x${string}`, JSON.stringify(msg.eipToSign)],
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

  //       return rawTx;
  //     } else {
  //       throw new Error('No haqqChain');
  //     }
  //   },
  //   [ethAddress, haqqChain, walletClient],
  // );

  const getPeriods = useCallback(
    (amount: number, lockupInDays: number, vestingInDays: number) => {
      const cliff = lockupInDays * 24 * 60 * 60;
      const periodLength = 24 * 60 * 60;
      const periods = vestingInDays;
      const denom = 'aISLM';
      const lockupPeriods = [];
      let restAmount = amount;
      let unlockAmount = Math.floor(amount / periods);
      let length: number = cliff;

      for (let i = 0; i < periods; i++) {
        if (i === periods - 1) {
          unlockAmount = restAmount;
        }

        const unlockCoins = {
          denom: denom,
          amount: BigInt(unlockAmount * 10 ** 18).toString(),
        };

        const period = {
          length: length,
          amount: [unlockCoins],
        };

        lockupPeriods.push(period);
        restAmount -= unlockAmount;

        if (i === 0) {
          length = periodLength;
        }
      }

      return {
        lockupPeriods,
        vestingPeriods: [] as typeof lockupPeriods,
      };
    },
    [],
  );

  const getParams = useCallback(
    async (
      fromAddress: string,
      toAddress: string,
      amount: number,
      startTime: number,
      lockupInDays: number,
      vestingInDays: number,
    ) => {
      const { lockupPeriods, vestingPeriods } = getPeriods(
        amount,
        lockupInDays,
        vestingInDays,
      );

      const createParams: MessageMsgCreateClawbackVestingAccount = {
        fromAddress,
        toAddress,
        startTime,
        lockupPeriods,
        vestingPeriods,
        merge: false,
      };

      return createParams;
    },
    [getPeriods],
  );

  const handleCreateNew = useCallback(
    async (
      toAddress: string,
      amount: number,
      startTime: number,
      lockupInDays: number,
      vestingInDays: number,
    ) => {
      console.log('handleCreateNew', {
        toAddress,
        startTime,
        lockupInDays,
        vestingInDays,
      });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      // const memo = `Create vesting account with address ${toAddress}`;

      if (sender && haqqChain && ethAddress) {
        // const createParams = await getParams(
        //   sender.accountAddress,
        //   toAddress,
        //   amount,
        //   startTime,
        //   lockupInDays,
        //   vestingInDays,
        // );

        // const msg = createTxCreateClawbackVestingAccount(
        //   haqqChain,
        //   sender,
        //   DEFAULT_FEE,
        //   memo,
        //   createParams,
        // );
        // console.log({ msg });

        // const rawTx = await signTransaction(msg, sender);
        // const txResponse = await broadcastTransaction(rawTx);

        // return txResponse;
        return { txhash: 'foo' };
      } else {
        throw new Error('No sender');
      }
    },
    [ethAddress, getPubkey, getSender, haqqAddress, haqqChain],
  );

  return useMemo(() => {
    return {
      createNew: handleCreateNew,
      getParams,
      getPeriods,
    };
  }, [getParams, getPeriods, handleCreateNew]);
}

// const MSG_CONVERT_TO_CLAWBACK_VESTING_ACCOUNT = {};

// function createTxCreateClawbackVestingAccount(
//   chain: any,
//   sender: any,
//   fee: any,
//   memo: any,
//   params: any,
// ) {
//   const feeObject = generateFee(
//     fee.amount,
//     fee.denom,
//     fee.gas,
//     sender.accountAddress,
//   );
//   const types = generateTypes(MSG_CONVERT_TO_CLAWBACK_VESTING_ACCOUNT);
//   const msg = createEipMsgConvertToClawbackVestingAccount(
//     params.fromAddress,
//     params.toAddress,
//     params.startTime,
//     params.lockupPeriods,
//     params.vestingPeriods,
//     params.merge,
//   );
//   const messages = generateMessage(
//     sender.accountNumber.toString(),
//     sender.sequence.toString(),
//     chain.cosmosChainId,
//     memo,
//     feeObject,
//     msg,
//   );
//   const eipToSign = createEIP712(types, chain.chainId, messages);
//   const msgCosmos = createComsosMsgConvertToClawbackVestingAccount(
//     params.fromAddress,
//     params.toAddress,
//     params.startTime,
//     params.lockupPeriods,
//     params.vestingPeriods,
//     params.merge,
//   );
//   const tx = createTransaction(
//     msgCosmos,
//     memo,
//     fee.amount,
//     fee.denom,
//     Number.parseInt(fee.gas, 10),
//     'ethsecp256',
//     sender.pubkey,
//     sender.sequence,
//     sender.accountNumber,
//     chain.cosmosChainId,
//   );
//   return {
//     signDirect: tx.signDirect,
//     legacyAmino: tx.legacyAmino,
//     eipToSign,
//   };
// }

// export function createComsosMsgConvertToClawbackVestingAccount(
//   fromAddress: string,
//   toAddress: string,
//   startTime: number,
//   lockupPeriods: Period[],
//   vestingPeriods: Period[],
//   merge: boolean,
// ) {
//   // const msg = createProtoMsgConvertToClawbackVestingAccount(
//   //   fromAddress,
//   //   toAddress,
//   //   startTime,
//   //   lockupPeriods,
//   //   vestingPeriods,
//   //   merge,
//   // );

//   return {
//     message: 'msg',
//     path: 'haqq.vesting.v1.MsgConvertIntoVestingAccount',
//   };
// }

// export function createEipMsgConvertToClawbackVestingAccount(
//   from_address: string,
//   to_address: string,
//   start_time: number,
//   lockup_periods: Period[],
//   vesting_periods: Period[],
//   merge: boolean,
// ) {
//   // EIP712 requires the date to be a string in format YYYY-MM-DDTHH:MM:SSZ
//   const date = new Date();
//   date.setTime(start_time * 1000);
//   let startTime = date.toISOString();
//   startTime = startTime.replace('.000Z', 'Z');

//   return {
//     type: 'haqq/MsgConvertIntoVestingAccount',
//     value: {
//       from_address,
//       to_address,
//       start_time: startTime,
//       lockup_periods,
//       vesting_periods,
//       merge,
//       stake: false,
//     },
//   };
// }
