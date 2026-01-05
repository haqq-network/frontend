// ABI for Waitlist contract
export const WaitlistAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AlreadyFinalized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AmountMustBeGreaterThanZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotCancelInCurrentState',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotCloseRequests',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotOpenRequests',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotSubmitRequests',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidBackendSignature',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidState',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyAuthorCanCancel',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RequestAlreadyCancelled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RequestDoesNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RequestsAlreadyFinalized',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldSigner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newSigner',
        type: 'address',
      },
    ],
    name: 'BackendSignerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
    ],
    name: 'RequestCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum Waitlist.FundsSource',
        name: 'source',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'backendSignature',
        type: 'bytes',
      },
    ],
    name: 'RequestCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'RequestsClosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'RequestsFinalized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'RequestsOpened',
    type: 'event',
  },
  {
    inputs: [],
    name: 'backendSigner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'canSubmit',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'canWithdraw',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'cancelRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'enum Waitlist.FundsSource',
        name: 'source',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'backendSignature',
        type: 'bytes',
      },
    ],
    name: 'createRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentState',
    outputs: [
      {
        internalType: 'enum Waitlist.RequestsState',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'getRequestById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'requestId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'enum Waitlist.FundsSource',
            name: 'source',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
          {
            internalType: 'bytes',
            name: 'backendSignature',
            type: 'bytes',
          },
        ],
        internalType: 'struct Waitlist.Request',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getRequestsByUser',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalAmount',
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
  {
    inputs: [],
    name: 'getTotalCount',
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
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
