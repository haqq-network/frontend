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
  MsgFund,
  MsgTransferOwnership,
} from '../../haqq-proto/haqq/ucdao/v1/tx_pb';

// FUND
export interface MsgFundParams {
  depositor: string;
  amount: string;
  denom: string;
}

export const MSG_FUND_TYPES = {
  MsgValue: [
    { name: 'amount', type: 'TypeAmount[]' },
    { name: 'depositor', type: 'string' },
  ],
  TypeAmount: [
    { name: 'denom', type: 'string' },
    { name: 'amount', type: 'string' },
  ],
};

export class MsgFundHaqqed extends MsgFund {
  private serializeBinary = this.toBinary;
}

export function createMsgFund(
  depositor: string,
  amount: string,
  denom: string,
) {
  return {
    type: 'haqq/ucdao/MsgFund',
    value: {
      depositor,
      amount: [{ amount, denom }],
    },
  };
}

function protoMsgFund(depositor: string, amount: string, denom: string) {
  const coin = new Coin({
    denom,
    amount,
  });

  const message = new MsgFundHaqqed({
    depositor,
    amount: [coin],
  });
  // const message = MsgFund.fromJson({
  //   depositor,
  //   amount: [
  //     {
  //       denom,
  //       amount,
  //     },
  //   ],
  // });

  // message.serializeBinary = message.toBinary;

  return {
    path: 'haqq.ucdao.v1.MsgFund',
    message,
  };
}

export function createTxMsgFund(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MsgFundParams,
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  );
  const types = generateTypes(MSG_FUND_TYPES);
  const msg = createMsgFund(params.depositor, params.amount, params.denom);
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
  const protoMessage = protoMsgFund(
    params.depositor,
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

// TRANSFER
export interface MsgTransferOwnershipParams {
  owner: string;
  newOwner: string;
}

export const MSG_TRANSFER_OWNERSHIP_TYPES = {
  MsgValue: [
    { name: 'owner', type: 'string' },
    { name: 'new_owner', type: 'string' },
  ],
};

export class MsgTransferOwnershipHaqqed extends MsgTransferOwnership {
  private serializeBinary = this.toBinary;
}

export function createMsgTransferOwnership(owner: string, newOwner: string) {
  return {
    type: 'haqq/ucdao/MsgTransferOwnership',
    value: {
      owner: owner,
      new_owner: newOwner,
    },
  };
}

function protoMsgTransferOwnership(owner: string, newOwner: string) {
  const message = new MsgTransferOwnershipHaqqed({
    owner,
    newOwner,
  });

  return {
    path: 'haqq.ucdao.v1.MsgTransferOwnership',
    message,
  };
}

export function createTxMsgTransferOwnership(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MsgTransferOwnershipParams,
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  );
  const types = generateTypes(MSG_TRANSFER_OWNERSHIP_TYPES);
  const msg = createMsgTransferOwnership(params.owner, params.newOwner);
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
  const protoMessage = protoMsgTransferOwnership(params.owner, params.newOwner);

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
