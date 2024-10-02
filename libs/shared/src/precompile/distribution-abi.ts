import { Abi } from 'viem';

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
    name: 'withdrawDelegatorRewards',
    outputs: [
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
        internalType: 'struct Coin[]',
        name: 'amount',
        type: 'tuple[]',
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
      {
        internalType: 'uint32',
        name: 'maxRetrieve',
        type: 'uint32',
      },
    ],
    name: 'claimRewards',
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

export const delegationTotalRewardsAbi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatorAddress',
        type: 'address',
      },
    ],
    name: 'delegationTotalRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'validatorAddress',
            type: 'string',
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
              {
                internalType: 'uint8',
                name: 'precision',
                type: 'uint8',
              },
            ],
            internalType: 'struct DecCoin[]',
            name: 'reward',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct DelegationDelegatorReward[]',
        name: 'rewards',
        type: 'tuple[]',
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
          {
            internalType: 'uint8',
            name: 'precision',
            type: 'uint8',
          },
        ],
        internalType: 'struct DecCoin[]',
        name: 'total',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
