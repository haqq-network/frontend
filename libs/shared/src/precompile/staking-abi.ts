import { Abi } from 'viem';

export const delegateAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatorAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'validatorAddress',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'delegate',
    outputs: [
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const undelegateAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatorAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'validatorAddress',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'undelegate',
    outputs: [
      {
        internalType: 'int64',
        name: 'completionTime',
        type: 'int64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const redelegateAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatorAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'validatorSrcAddress',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'validatorDstAddress',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'redelegate',
    outputs: [
      {
        internalType: 'int64',
        name: 'completionTime',
        type: 'int64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const stakingMessageTypes = [
  '/cosmos.staking.v1beta1.MsgDelegate',
  '/cosmos.staking.v1beta1.MsgUndelegate',
  '/cosmos.staking.v1beta1.MsgBeginRedelegate',
];

export const approveAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'string[]',
        name: 'methods',
        type: 'string[]',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const allowanceAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'method',
        type: 'string',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
