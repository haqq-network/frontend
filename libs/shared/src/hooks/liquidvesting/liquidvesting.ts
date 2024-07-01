import {
  generateFee,
  generateTypes,
  generateMessage,
  createEIP712,
} from '@evmos/eip712';
import { createTransaction } from '@evmos/proto';
import { Sender, Chain, Fee } from '@evmos/transactions';
import { Coin } from '../../haqq-proto/cosmos/base/v1beta1/coin_pb';
import {
  MsgLiquidate,
  MsgRedeem,
} from '../../haqq-proto/haqq/liquidvesting/v1/tx_pb';

export interface MsgLiquidateParams {
  liquidateTo: string;
  amount: string;
  denom: string;
}

export interface MsgRedeemParams {
  redeemTo: string;
  amount: string;
  denom: string;
}

export const MSG_LIQUIDATE_TYPES = {
  MsgValue: [
    { name: 'liquidate_from', type: 'string' },
    { name: 'liquidate_to', type: 'string' },
    { name: 'amount', type: 'TypeAmount' },
  ],
  TypeAmount: [
    { name: 'denom', type: 'string' },
    { name: 'amount', type: 'string' },
  ],
};

export const MSG_REDEEM_TYPES = {
  MsgValue: [
    { name: 'redeem_from', type: 'string' },
    { name: 'redeem_to', type: 'string' },
    { name: 'amount', type: 'TypeAmount' },
  ],
  TypeAmount: [
    { name: 'denom', type: 'string' },
    { name: 'amount', type: 'string' },
  ],
};

export function createMsgLiquidate(
  liquidateFrom: string,
  liquidateTo: string,
  amount: string,
  denom: string,
) {
  return {
    type: 'haqq/MsgLiquidate',
    value: {
      liquidate_from: liquidateFrom,
      liquidate_to: liquidateTo,
      amount: {
        amount,
        denom,
      },
    },
  };
}

export function createMsgRedeem(
  redeemFrom: string,
  redeemTo: string,
  amount: string,
  denom: string,
) {
  return {
    type: 'haqq/MsgRedeem',
    value: {
      redeem_from: redeemFrom,
      redeem_to: redeemTo,
      amount: {
        amount,
        denom,
      },
    },
  };
}

export class MsgLiquidateHaqqed extends MsgLiquidate {
  private serializeBinary = this.toBinary;
}

export class MsgRedeemHaqqed extends MsgRedeem {
  private serializeBinary = this.toBinary;
}

function protoMsgLiquidate(
  liquidateFrom: string,
  liquidateTo: string,
  amount: string,
  denom: string,
) {
  const value = new Coin({
    denom,
    amount,
  });

  const message = new MsgLiquidateHaqqed({
    liquidateFrom,
    liquidateTo,
    amount: value,
  });

  return {
    path: 'haqq.liquidvesting.v1.MsgLiquidate',
    message,
  };
}

function protoMsgRedeem(
  redeemFrom: string,
  redeemTo: string,
  amount: string,
  denom: string,
) {
  const value = new Coin({
    denom,
    amount,
  });

  const message = new MsgRedeemHaqqed({
    redeemFrom,
    redeemTo,
    amount: value,
  });

  return {
    path: 'haqq.liquidvesting.v1.MsgRedeem',
    message,
  };
}

export function createTxMsgLiquidate(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MsgLiquidateParams,
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  );
  const types = generateTypes(MSG_LIQUIDATE_TYPES);
  const msg = createMsgLiquidate(
    sender.accountAddress,
    params.liquidateTo,
    params.amount,
    params.denom,
  );
  const messages = generateMessage(
    sender.accountNumber.toString(),
    sender.sequence.toString(),
    chain.cosmosChainId,
    memo,
    feeObject,
    msg,
  );
  const eipToSign = createEIP712(types, chain.chainId, messages);

  // Cosmos
  const protoMessage = protoMsgLiquidate(
    sender.accountAddress,
    params.liquidateTo,
    params.amount,
    params.denom,
  );

  const tx = createTransaction(
    protoMessage,
    memo,
    fee.amount,
    fee.denom,
    parseInt(fee.gas, 10),
    'ethsecp256',
    sender.pubkey,
    sender.sequence,
    sender.accountNumber,
    chain.cosmosChainId,
  );

  return {
    signDirect: tx.signDirect,
    legacyAmino: tx.legacyAmino,
    eipToSign,
  };
}
export function createTxMsgRedeem(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MsgRedeemParams,
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  );
  const types = generateTypes(MSG_REDEEM_TYPES);
  const msg = createMsgRedeem(
    sender.accountAddress,
    params.redeemTo,
    params.amount,
    params.denom,
  );
  const messages = generateMessage(
    sender.accountNumber.toString(),
    sender.sequence.toString(),
    chain.cosmosChainId,
    memo,
    feeObject,
    msg,
  );
  const eipToSign = createEIP712(types, chain.chainId, messages);

  // Cosmos
  const protoMessage = protoMsgRedeem(
    sender.accountAddress,
    params.redeemTo,
    params.amount,
    params.denom,
  );

  const tx = createTransaction(
    protoMessage,
    memo,
    fee.amount,
    fee.denom,
    parseInt(fee.gas, 10),
    'ethsecp256',
    sender.pubkey,
    sender.sequence,
    sender.accountNumber,
    chain.cosmosChainId,
  );

  return {
    signDirect: tx.signDirect,
    legacyAmino: tx.legacyAmino,
    eipToSign,
  };
}
