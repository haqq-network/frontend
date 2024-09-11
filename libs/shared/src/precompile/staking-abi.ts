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

export const withdrawDelegatorRewardAbi: Abi = [
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
    ],
    name: 'withdrawDelegatorReward',
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

export const withdrawAllDelegatorRewardsAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatorAddress',
        type: 'address',
      },
    ],
    name: 'withdrawAllDelegatorRewards',
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

// These additional methods (getValidatorAbi and getDelegationAbi) can be useful for retrieving information about validators and delegations,
// which might be necessary for displaying data to users or making decisions in the application logic.

export const getValidatorAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'validatorAddress',
        type: 'string',
      },
    ],
    name: 'validator',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'operatorAddress',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'consensusPubkey',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'jailed',
            type: 'bool',
          },
          {
            internalType: 'enum BondStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'tokens',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'delegatorShares',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'int64',
            name: 'unbondingHeight',
            type: 'int64',
          },
          {
            internalType: 'int64',
            name: 'unbondingTime',
            type: 'int64',
          },
          {
            internalType: 'uint256',
            name: 'commission',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minSelfDelegation',
            type: 'uint256',
          },
        ],
        internalType: 'struct Validator',
        name: 'validator',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const getDelegationAbi: Abi = [
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
    ],
    name: 'delegation',
    outputs: [
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'denom',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Coin',
        name: 'balance',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
