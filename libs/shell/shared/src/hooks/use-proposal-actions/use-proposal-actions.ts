import { useCallback } from 'react';
import { Message } from '@bufbuild/protobuf';
import {
  generateFee,
  generateTypes,
  generateMessage,
  createEIP712,
  createMsgSubmitProposal,
  MSG_SUBMIT_TYPES,
} from '@evmos/eip712';
import {
  createAnyMessage,
  createMsgDeposit,
  // createMsgSubmitProposal as createMsgSubmitProposalCosmos,
  createMsgVote,
  createTxRaw,
} from '@evmos/proto';
import { createTransaction } from '@evmos/proto';
import * as coinProto from '@evmos/proto/dist/proto/cosmos/base/v1beta1/coin';
import * as govProto from '@evmos/proto/dist/proto/cosmos/gov/v1beta1/gov';
import * as govTxProto from '@evmos/proto/dist/proto/cosmos/gov/v1beta1/tx';
import * as upgradeProto from '@evmos/proto/dist/proto/cosmos/upgrade/v1beta1/upgrade';
import {
  createTxMsgVote,
  createTxMsgDeposit,
  // createTxMsgSubmitProposal,
} from '@evmos/transactions';
import type {
  Chain,
  Fee,
  MessageMsgDepositParams,
  MessageMsgSubmitProposal,
  Sender,
} from '@evmos/transactions';
import { Keplr } from '@keplr-wallet/types';
// import { Any } from 'cosmjs-types/google/protobuf/any';
import Long from 'long';
import { formatUnits, toHex } from 'viem';
import { useNetwork } from 'wagmi';
import {
  BroadcastTxResponse,
  DEFAULT_FEE,
  VESTING_DEFAULT_FEE,
  getChainParams,
} from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { useWallet } from '../../providers/wallet-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { useAddress } from '../use-address/use-address';

const { TextProposal } = govProto.cosmos.gov.v1beta1;
const { Plan, SoftwareUpgradeProposal } = upgradeProto.cosmos.upgrade.v1beta1;

interface ProposalActionsHook {
  vote: (
    proposalId: number,
    option: number,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  deposit: (
    proposalId: number,
    amount: number,
    balance?: number,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  getVoteEstimatedFee: (
    proposalId: number,
    option: number,
  ) => Promise<EstimatedFeeResponse>;
  getDepositEstimatedFee: (
    proposalId: number,
    amount: number,
  ) => Promise<EstimatedFeeResponse>;
  submitTextProposal: (
    proposalParams: CreateTextProposalForm,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  submitSuProposal: (
    proposalParams: CreateTextProposalForm,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  submitProposalKeplr: (
    proposalParams: CreateTextProposalForm,
    keplr: Keplr,
  ) => Promise<BroadcastTxResponse>;
  submitProposalSoftwareUpgradeKeplr: (
    proposalParams: CreateUpgradeProposalForm,
    keplr: Keplr,
  ) => Promise<BroadcastTxResponse>;
}

export interface CreateTextProposalForm {
  title: string;
  description: string;
  initialDeposit: number;
}

export interface CreateUpgradeProposalForm {
  title: string;
  description: string;
  initialDeposit: number;
  applyHeight: number;
  planName: string;
  plan: string;
}

export const MSG_SUBMIT_TEXT_PROPOSAL_TYPES = {
  MsgValue: [
    { name: 'content', type: 'TextProposal' },
    { name: 'initial_deposit', type: 'Coin[]' },
    { name: 'proposer', type: 'string' },
  ],
  TextProposal: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'value',
      type: 'TextProposalContent',
    },
  ],
  TextProposalContent: [
    {
      name: 'path',
      type: 'string',
    },
    {
      name: 'message',
      type: 'string',
    },
  ],
};

export const MSG_SUBMIT_UPGRADE_PROPOSAL_TYPES = {
  MsgValue: [
    { name: 'content', type: 'UpgradeProposal' },
    { name: 'initial_deposit', type: 'Coin[]' },
    { name: 'proposer', type: 'string' },
  ],
  UpgradeProposal: [
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'value',
      type: 'UpgradeProposalContent',
    },
  ],
  UpgradeProposalContent: [
    { name: '@type', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'plan', type: 'Plan' },
  ],
  Plan: [
    { name: 'name', type: 'string' },
    { name: 'time', type: 'string' },
    { name: 'height', type: 'string' },
    { name: 'info', type: 'string' },
  ],
};

function createMsgSubmitProposalTxtEIP712(
  content: any,
  initialDepositDenom: string,
  initialDepositAmount: string,
  proposer: string,
) {
  console.log('createMsgSubmitProposalEIP712', {
    content,
    initialDepositDenom,
    initialDepositAmount,
    proposer,
  });
  return {
    type: 'cosmos-sdk/MsgSubmitProposal',
    value: {
      content: {
        type: 'cosmos-sdk/TextProposal',
        value: {
          '@type': 'cosmos.gov.v1beta1.TextProposal',
          ...content.toObject(),
        },
      },
      initial_deposit: [
        {
          amount: initialDepositAmount,
          denom: initialDepositDenom,
        },
      ],
      proposer,
    },
  };
}

function createMsgSubmitProposalSuEIP712(
  content: any,
  initialDepositDenom: string,
  initialDepositAmount: string,
  proposer: string,
) {
  console.log('createMsgSubmitProposalEIP712', {
    content,
    initialDepositDenom,
    initialDepositAmount,
    proposer,
  });
  return {
    type: 'cosmos-sdk/MsgSubmitProposal',
    value: {
      content: {
        type: 'cosmos-sdk/TextProposal',
        value: {
          '@type': 'cosmos.gov.v1beta1.TextProposal',
          ...content.toObject(),
        },
      },
      initial_deposit: [
        {
          amount: initialDepositAmount,
          denom: initialDepositDenom,
        },
      ],
      proposer,
    },
  };
}

function createTxMsgSubmitSuProposal(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MessageMsgSubmitProposal,
  contentPath: string,
) {
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  );
  const types = generateTypes(MSG_SUBMIT_UPGRADE_PROPOSAL_TYPES);
  const msg = createMsgSubmitProposalsSuEIP712(
    params.content,
    params.initialDepositDenom,
    params.initialDepositAmount,
    sender.accountAddress,
  );
  console.log({ msg });
  const messages = generateMessage(
    sender.accountNumber.toString(),
    sender.sequence.toString(),
    chain.cosmosChainId,
    memo,
    feeObject,
    msg,
  );
  console.log({ messages });
  const eipToSign = createEIP712(types, chain.chainId, messages);
  console.log({ eipToSign });
  const msgCosmos = createMsgSubmitProposalCosmos(
    params.content,
    contentPath,
    params.initialDepositDenom,
    params.initialDepositAmount,
    sender.accountAddress,
  );
  console.log({ msgCosmos });
  const tx = createTransaction(
    msgCosmos,
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

function createTxMsgSubmitTxtProposal(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MessageMsgSubmitProposal,
  contentPath: string,
) {
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  );
  const types = generateTypes(MSG_SUBMIT_TEXT_PROPOSAL_TYPES);
  const msg = createMsgSubmitProposalTxtEIP712(
    params.content,
    params.initialDepositDenom,
    params.initialDepositAmount,
    sender.accountAddress,
  );
  console.log({ msg });
  const messages = generateMessage(
    sender.accountNumber.toString(),
    sender.sequence.toString(),
    chain.cosmosChainId,
    memo,
    feeObject,
    msg,
  );
  console.log({ messages });
  const eipToSign = createEIP712(types, chain.chainId, messages);
  console.log({ eipToSign });
  const msgCosmos = createMsgSubmitProposalCosmos(
    params.content,
    contentPath,
    params.initialDepositDenom,
    params.initialDepositAmount,
    sender.accountAddress,
  );
  console.log({ msgCosmos });
  const tx = createTransaction(
    msgCosmos,
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

function createMsgSubmitProposalCosmos(
  content: Message,
  contentPath: string,
  initialDepositDenom: any,
  initialDepositAmount: any,
  proposer: any,
) {
  const initialDeposit = new coinProto.cosmos.base.v1beta1.Coin({
    denom: initialDepositDenom,
    amount: initialDepositAmount,
  });

  const msg = new govTxProto.cosmos.gov.v1beta1.MsgSubmitProposal({
    content: createAnyMessage({
      path: contentPath,
      message: content,
    }),
    initial_deposit: [initialDeposit],
    proposer,
  });

  return {
    message: msg,
    path: 'cosmos.gov.v1beta1.MsgSubmitProposal',
  };
}

export function useProposalActions(): ProposalActionsHook {
  const {
    broadcastTransaction,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const { getPubkey, signTransaction } = useWallet();
  const chains = useSupportedChains();
  const { haqqAddress, ethAddress } = useAddress();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);
  const { getAccountBaseInfo } = useCosmosService();

  const handleVote = useCallback(
    async (
      proposalId: number,
      option: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleVote', { proposalId, option });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Vote for proposal #${proposalId}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const voteParams = {
          proposalId,
          option,
        };
        const msg = createTxMsgVote(haqqChain, sender, fee, memo, voteParams);
        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
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
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleDeposit = useCallback(
    async (
      proposalId: number,
      amount: number,
      balance?: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleDeposit', { proposalId, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Deposit to proposal #${proposalId}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const depositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: getAmountIncludeFee(amount, balance ?? 0, fee),
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

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
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
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleVoteEstimatedFee = useCallback(
    async (proposalId: number, option: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgVote(proposalId, option, haqqAddress as string);
      const memo = `Vote for proposal #${proposalId}`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
        pubkey,
      );
    },
    [
      getPubkey,
      ethAddress,
      haqqAddress,
      getEstimatedFee,
      haqqChain.cosmosChainId,
    ],
  );

  const handleDepositEstimatedFee = useCallback(
    async (proposalId: number, amount: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgDeposit(proposalId, haqqAddress as string, {
        amount: formatUnits(BigInt(amount), 18),
        denom: 'aISLM',
      });
      const memo = `Deposit to proposal #${proposalId}`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
        pubkey,
      );
    },
    [
      getPubkey,
      ethAddress,
      haqqAddress,
      getEstimatedFee,
      haqqChain.cosmosChainId,
    ],
  );

  const handleSubmitTextProposal = useCallback(
    async (
      submitProposalData: CreateTextProposalForm,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleSubmitProposal', { submitProposalData, estimatedFee });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Submit proposal ${submitProposalData.title}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const proposalParams: MessageMsgSubmitProposal = {
          content: TextProposal.fromObject({
            title: submitProposalData.title,
            description: submitProposalData.description,
          }),
          proposer: sender.accountAddress,
          initialDepositAmount: BigInt(
            submitProposalData.initialDeposit * 10 ** 18,
          ).toString(),
          initialDepositDenom: 'aISLM',
        };

        console.log({ proposalParams });

        const msg = createTxMsgSubmitTxtProposal(
          haqqChain,
          sender,
          fee,
          memo,
          proposalParams,
          'cosmos.gov.v1beta1.TextProposal',
        );
        console.log({ msg });
        const rawTx = await signTransaction(msg, sender);
        console.log({ rawTx });
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
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
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleSubmitSuProposal = useCallback(
    async (
      submitProposalData: CreateTextProposalForm,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleSubmitProposal', { submitProposalData, estimatedFee });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Submit proposal ${submitProposalData.title}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const proposalParams: MessageMsgSubmitProposal = {
          content: TextProposal.fromObject({
            title: submitProposalData.title,
            description: submitProposalData.description,
          }),
          proposer: sender.accountAddress,
          initialDepositAmount: BigInt(
            submitProposalData.initialDeposit * 10 ** 18,
          ).toString(),
          initialDepositDenom: 'aISLM',
        };

        console.log({ proposalParams });

        const msg = createTxMsgSubmitSuProposal(
          haqqChain,
          sender,
          fee,
          memo,
          proposalParams,
          'cosmos.gov.v1beta1.SoftwareUpgradeProposal',
        );
        console.log({ msg });
        const rawTx = await signTransaction(msg, sender);
        console.log({ rawTx });
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
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
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleSubmitProposalKeplr = useCallback(
    async (submitProposalData: CreateTextProposalForm, keplr: Keplr) => {
      console.log('handleSubmitProposalKeplr', {
        submitProposalData,
        keplr,
      });
      const memo = `Submit proposal "${submitProposalData.title}"`;

      if (haqqChain) {
        const offlineSigner = keplr.getOfflineSigner(haqqChain.cosmosChainId);
        const accounts = await offlineSigner.getAccounts();
        const currentAccount = accounts[0];
        const pubkeyFromKeplr = Buffer.from(currentAccount.pubkey).toString(
          'base64',
        );
        const fromChain = await getAccountBaseInfo(currentAccount.address);
        const sender: Sender = {
          accountAddress: currentAccount.address,
          pubkey: pubkeyFromKeplr,
          sequence: Number(fromChain?.sequence),
          accountNumber: Number(fromChain?.account_number),
        };

        const proposalParams: MessageMsgSubmitProposal = {
          content: TextProposal.fromObject({
            title: submitProposalData.title,
            description: submitProposalData.description,
          }),
          proposer: sender.accountAddress,
          initialDepositAmount: BigInt(
            submitProposalData.initialDeposit * 10 ** 18,
          ).toString(),
          initialDepositDenom: 'aISLM',
        };
        const msgCosmos = createMsgSubmitProposalCosmos(
          proposalParams.content,
          'cosmos.gov.v1beta1.TextProposal',
          proposalParams.initialDepositDenom,
          proposalParams.initialDepositAmount,
          sender.accountAddress,
        );
        console.log({ msgCosmos });
        const tx = createTransaction(
          msgCosmos,
          memo,
          VESTING_DEFAULT_FEE.amount,
          VESTING_DEFAULT_FEE.denom,
          parseInt(VESTING_DEFAULT_FEE.gas, 10),
          'ethsecp256',
          sender.pubkey,
          sender.sequence,
          sender.accountNumber,
          haqqChain.cosmosChainId,
        );
        console.log({ tx });

        const signResponse = await offlineSigner.signDirect(
          sender.accountAddress,
          {
            bodyBytes: tx.signDirect.body.serializeBinary(),
            authInfoBytes: tx.signDirect.authInfo.serializeBinary(),
            chainId: haqqChain.cosmosChainId,
            accountNumber: new Long(sender.accountNumber),
          },
        );

        if (!signResponse) {
          // Handle signature failure here.
        }

        const signatures = [
          new Uint8Array(
            Buffer.from(signResponse.signature.signature, 'base64'),
          ),
        ];

        const { signed } = signResponse;

        const signedTx = createTxRaw(
          signed.bodyBytes,
          signed.authInfoBytes,
          signatures,
        );
        const txResponse = await broadcastTransaction(signedTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
      } else {
        throw new Error('No sender');
      }
    },
    [haqqChain, getAccountBaseInfo, broadcastTransaction, getTransactionStatus],
  );

  const handleSubmitProposalSoftwareUpgradeKeplr = useCallback(
    async (submitProposalData: CreateUpgradeProposalForm, keplr: Keplr) => {
      console.log('handleSubmitProposalSoftwareUpgradeKeplr', {
        submitProposalData,
        keplr,
      });
      const memo = `Submit proposal software upgrade proposal: "${submitProposalData.title}"`;

      if (haqqChain) {
        const offlineSigner = keplr.getOfflineSigner(haqqChain.cosmosChainId);
        const accounts = await offlineSigner.getAccounts();
        const currentAccount = accounts[0];
        const pubkeyFromKeplr = Buffer.from(currentAccount.pubkey).toString(
          'base64',
        );
        const fromChain = await getAccountBaseInfo(currentAccount.address);
        const sender: Sender = {
          accountAddress: currentAccount.address,
          pubkey: pubkeyFromKeplr,
          sequence: Number(fromChain?.sequence),
          accountNumber: Number(fromChain?.account_number),
        };

        const proposalParams: MessageMsgSubmitProposal = {
          content: SoftwareUpgradeProposal.fromObject({
            title: submitProposalData.title,
            description: submitProposalData.description,
            plan: Plan.fromObject({
              name: submitProposalData.planName,
              height: submitProposalData.applyHeight,
              info: submitProposalData.plan,
            }),
          }),
          proposer: sender.accountAddress,
          initialDepositAmount: BigInt(
            submitProposalData.initialDeposit * 10 ** 18,
          ).toString(),
          initialDepositDenom: 'aISLM',
        };
        const msgCosmos = createMsgSubmitProposalCosmos(
          proposalParams.content,
          'cosmos.upgrade.v1beta1.SoftwareUpgradeProposal',
          proposalParams.initialDepositDenom,
          proposalParams.initialDepositAmount,
          sender.accountAddress,
        );

        const tx = createTransaction(
          msgCosmos,
          memo,
          VESTING_DEFAULT_FEE.amount,
          VESTING_DEFAULT_FEE.denom,
          parseInt(VESTING_DEFAULT_FEE.gas, 10),
          'ethsecp256',
          sender.pubkey,
          sender.sequence,
          sender.accountNumber,
          haqqChain.cosmosChainId,
        );

        const signResponse = await offlineSigner.signDirect(
          sender.accountAddress,
          {
            bodyBytes: tx.signDirect.body.serializeBinary(),
            authInfoBytes: tx.signDirect.authInfo.serializeBinary(),
            chainId: haqqChain.cosmosChainId,
            accountNumber: new Long(sender.accountNumber),
          },
        );

        if (!signResponse) {
          // Handle signature failure here.
          throw new Error('Transaction signature failed');
        }

        const { signed, signature } = signResponse;

        const signatures = [
          new Uint8Array(Buffer.from(signature.signature, 'base64')),
        ];

        const signedTx = createTxRaw(
          signed.bodyBytes,
          signed.authInfoBytes,
          signatures,
        );

        const txResponse = await broadcastTransaction(signedTx);
        // const txResponse = await keplr.sendTx(
        //   'haqq_11235-1',
        //   signedTx.message.serializeBinary(),
        //   BroadcastMode.Sync,
        // );
        // console.log({
        //   txResponse,
        //   b: Buffer.from(txResponse).toString('base64'),
        // });

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
      } else {
        throw new Error('No sender');
      }
    },
    [haqqChain, getAccountBaseInfo, broadcastTransaction, getTransactionStatus],
  );

  return {
    vote: handleVote,
    deposit: handleDeposit,
    getVoteEstimatedFee: handleVoteEstimatedFee,
    getDepositEstimatedFee: handleDepositEstimatedFee,
    submitTextProposal: handleSubmitTextProposal,
    submitSuProposal: handleSubmitSuProposal,
    submitProposalKeplr: handleSubmitProposalKeplr,
    submitProposalSoftwareUpgradeKeplr:
      handleSubmitProposalSoftwareUpgradeKeplr,
  };
}
