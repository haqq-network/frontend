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
