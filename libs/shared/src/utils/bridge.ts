import { sepolia } from 'viem/chains';

const haqqTestethicRpcUrl = 'https://rpc.testethic.haqq.network/';

export const SWAPPABLE_TOKENS: {
  [chainId: number]: {
    symbol: string;
    address: string;
  }[];
} = {
  [sepolia.id]: [
    {
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    {
      symbol: 'USDC',
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    },
    {
      symbol: 'EURC',
      address: '0x08210f9170f89ab7658f0b5e3ff39b0e03c594d4',
    },
  ],
};

/**
 * Mapping of L1 token addresses to their corresponding L2 token addresses
 */
export const L1_TO_L2_TOKEN_MAP: {
  [l1Address: string]: string;
} = {
  // ETH remains the same address on both chains
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee':
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  // USDC mapping from L1 to L2
};

/**
 * Get the L2 token address for a given L1 token address
 * @param l1TokenAddress - The L1 token address
 * @returns The corresponding L2 token address or null if not found
 */
export function getL2TokenAddress(l1TokenAddress: string): string | null {
  return L1_TO_L2_TOKEN_MAP[l1TokenAddress.toLowerCase()] || null;
}

/**
 * Check if a token has a corresponding L2 deployment
 * @param l1TokenAddress - The L1 token address
 * @returns True if the token has an L2 counterpart
 */
export function hasL2Token(l1TokenAddress: string): boolean {
  return l1TokenAddress.toLowerCase() in L1_TO_L2_TOKEN_MAP;
}

/**
 * Network configuration for Superbridge HAQQ Devnet1
 *
 * @see https://explorer.devnet1.dev.haqq.network/
 */
export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  explorerUrl: string;
}

// Role addresses
export const ROLE_ADDRESSES = {
  proxyAdminOwner: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  protocolVersionsOwner: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  guardian: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  l1ProxyAdminOwner: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  l2ProxyAdminOwner: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  systemConfigOwner: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  unsafeBlockSigner: '0x12cA30dE061379E02d42b9303d5498bCb8Dd909B',
  batcher: '0x49180059AF02dB7660A3d09d7796459b0F181a69',
  proposer: '0x7876adF8a936347A543d1C41859e23034C021f2C',
  challenger: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
};

// Fee vault recipients
export const FEE_VAULT_RECIPIENTS = {
  baseFeeVaultRecipient: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  l1FeeVaultRecipient: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
  sequencerFeeVaultRecipient: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
};

export const BRIDGE_ADDRESSES: {
  SuperchainProxyAdminImpl: string;
  SuperchainConfigProxy: string;
  SuperchainConfigImpl: string;
  ProtocolVersionsProxy: string;
  ProtocolVersionsImpl: string;
  OpcmImpl: string;
  OpcmContractsContainerImpl: string;
  OpcmGameTypeAdderImpl: string;
  OpcmDeployerImpl: string;
  OpcmUpgraderImpl: string;
  OpcmInteropMigratorImpl: string;
  DelayedWethImpl: string;
  OptimismPortalImpl: string;
  EthLockboxImpl: string;
  PreimageOracleImpl: string;
  MipsImpl: string;
  SystemConfigImpl: string;
  L1CrossDomainMessengerImpl: string;
  L1Erc721BridgeImpl: string;
  L1StandardBridgeImpl: string;
  OptimismMintableErc20FactoryImpl: string;
  DisputeGameFactoryImpl: string;
  AnchorStateRegistryImpl: string;
  OpChainProxyAdminImpl: string;
  OptimismPortalProxy: string;
  AddressManagerImpl: string;
  L1Erc721BridgeProxy: string;
  SystemConfigProxy: string;
  OptimismMintableErc20FactoryProxy: string;
  L1StandardBridgeProxy: string;
  L1CrossDomainMessengerProxy: string;
  EthLockboxProxy: string;
  DisputeGameFactoryProxy: string;
  AnchorStateRegistryProxy: string;
  FaultDisputeGameImpl: string;
  PermissionedDisputeGameImpl: string;
  DelayedWethPermissionedGameProxy: string;
  DelayedWethPermissionlessGameProxy: string;
  AltDAChallengeProxy: string;
  AltDAChallengeImpl: string;
  L2OutputOracleProxy: string;
} = {
  SuperchainProxyAdminImpl: '0x03389e1d90d16db8c8aab7b7b5388e0661ad1b20',
  SuperchainConfigProxy: '0x7779c5b626bd93b444deee5296f1336c9a076a70',
  SuperchainConfigImpl: '0xce28685eb204186b557133766eca00334eb441e4',
  ProtocolVersionsProxy: '0x3d22989e9b049a073cb9f72cb3357367291508b6',
  ProtocolVersionsImpl: '0x37e15e4d6dffa9e5e320ee1ec036922e563cb76c',
  OpcmImpl: '0xeb816af3d7b9a61bca3415015b8e208c0be445e5',
  OpcmContractsContainerImpl: '0x0000000000000000000000000000000000000000',
  OpcmGameTypeAdderImpl: '0x77be751385562ec5f5074f1d3d80b9b7df0af77c',
  OpcmDeployerImpl: '0x4859c22632ac5ad6506df5f996098b73a11bba75',
  OpcmUpgraderImpl: '0x5b6820529748d5001c1a999176bfedabbf5fa64d',
  OpcmInteropMigratorImpl: '0x01b2f6aa2adc77c9a4a91d09a6e806ad51b0290a',
  DelayedWethImpl: '0x33dadc2d1aa9bb613a7ae6b28425ea00d44c6998',
  OptimismPortalImpl: '0xefed7f38bb9be74bba583a1a5b7d0fe7c9d5787a',
  EthLockboxImpl: '0x784d2f03593a42a6e4676a012762f18775ecbbe6',
  PreimageOracleImpl: '0x1fb8cdfc6831fc866ed9c51af8817da5c287add3',
  MipsImpl: '0xa1b54d89e305bcd322ba0c9c094093173c0d6b3a',
  SystemConfigImpl: '0xfaa660bf783cbaa55e1b7f3475c20db74a53b9fa',
  L1CrossDomainMessengerImpl: '0xd26bb3aaaa4cb5638a8581a4c4b1d937d8e05c54',
  L1Erc721BridgeImpl: '0x25d6cedeb277ad7ebee71226ed7877768e0b7a2f',
  L1StandardBridgeImpl: '0x44afb7722af276a601d524f429016a18b6923df0',
  OptimismMintableErc20FactoryImpl:
    '0x5493f4677a186f64805fe7317d6993ba4863988f',
  DisputeGameFactoryImpl: '0x33d1e8571a85a538ed3d5a4d88f46c112383439d',
  AnchorStateRegistryImpl: '0xeb69cc681e8d4a557b30dffbad85affd47a2cf2e',
  OpChainProxyAdminImpl: '0x2a0dc32ae8675792dfa23fd1526af5ae7907ef69',
  OptimismPortalProxy: '0xcef83e2c029f1bdfefbfd4cb908ac333f420e209',
  AddressManagerImpl: '0xe9a877d1712f17da500dac544a15616c2476e4d1',
  L1Erc721BridgeProxy: '0x67c74a530eab1f7b21adc441a836430a1ef792a9',
  SystemConfigProxy: '0xda718df88b54460dd4834b29c01658dd976c9e09',
  OptimismMintableErc20FactoryProxy:
    '0x65df5d4aa6371f63aa4ec935ed93a99f097e4abd',
  L1StandardBridgeProxy: '0xe6260411feffbff8a38ad32484ea01cbf1658a0e',
  L1CrossDomainMessengerProxy: '0xf8d52efc21fe3db1c1d651ee03d19c5f5b83597f',
  EthLockboxProxy: '0xfe3123d5157b9d104e34cbf73a9171854244d218',
  DisputeGameFactoryProxy: '0x1d15a66521bdb3043335734039d428f97bab3f7e',
  AnchorStateRegistryProxy: '0xc7c945a172b36efc6b6165f4d70a5b93a9f109d9',
  FaultDisputeGameImpl: '0x0000000000000000000000000000000000000000',
  PermissionedDisputeGameImpl: '0x563b50dc93936597974fbd59f055c3be151b297e',
  DelayedWethPermissionedGameProxy:
    '0x44c85f79783be56d7db48c060a9721a320fc57c7',
  DelayedWethPermissionlessGameProxy:
    '0x0000000000000000000000000000000000000000',
  AltDAChallengeProxy: '0x0000000000000000000000000000000000000000',
  AltDAChallengeImpl: '0x0000000000000000000000000000000000000000',
  L2OutputOracleProxy: '0x0000000000000000000000000000000000000000',
};

export const L1_STANDARD_BRIDGE_ADDRESS =
  BRIDGE_ADDRESSES.L1StandardBridgeProxy;

//  l2StandardBridgeProxyAddress https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/withdrawOptimismERC20.ts#L90
export const L2_STANDARD_BRIDGE_ADDRESS =
  '0x4200000000000000000000000000000000000010';

export const L2_OPTIMISM_MINTABLE_ERC20_FACTORY_ADDRESS =
  '0x4200000000000000000000000000000000000012';

// Additional configuration from TOML
export const DEPLOYMENT_CONFIG = {
  configType: 'standard-overrides',
  l1ChainId: sepolia.id, // Sepolia
  fundDevAccounts: false,
  useInterop: false,
  l1ContractsLocator: 'tag://op-contracts/v3.0.0-rc.2',
  l2ContractsLocator: 'tag://op-contracts/v3.0.0-rc.2',
  useFaultProofs: false,
  useCustomGasToken: false,
  enableGovernance: true,
};

// Time offsets for L2 genesis
export const L2_GENESIS_TIME_OFFSETS = {
  l2GenesisRegolithTimeOffset: '0x0',
  l2GenesisCanyonTimeOffset: '0x0',
  l2GenesisDeltaTimeOffset: '0x0',
  l2GenesisEcotoneTimeOffset: '0x0',
  l2GenesisFjordTimeOffset: '0x0',
  l2GenesisGraniteTimeOffset: '0x0',
  l2GenesisHoloceneTimeOffset: '0x0',
  l2GenesisIsthmusTimeOffset: '0x0',
};

// L1 time offsets
export const L1_TIME_OFFSETS = {
  l1CancunTimeOffset: '0x0',
  l1PragueTimeOffset: '0x0',
};

export const haqqTestethic = {
  id: 853211,
  name: 'Testethic',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [haqqTestethicRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'HAQQ Testethic',
      url: 'https://explorer.testethic.haqq.network',
      apiUrl: 'https://explorer.testethic.haqq.network/api',
    },
  },
  contracts: {
    portal: {
      [sepolia.id]: {
        address: BRIDGE_ADDRESSES.OptimismPortalProxy as `0x${string}`,
      },
    },
    disputeGameFactory: {
      [sepolia.id]: {
        address: BRIDGE_ADDRESSES.DisputeGameFactoryProxy as `0x${string}`,
      },
    },
    l2OutputOracle: {
      [sepolia.id]: {
        // deprecated https://docs.optimism.io/stack/smart-contracts/smart-contracts
        address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Placeholder
      },
    },
  },
};

// Chain configuration constants
export const CHAIN_CONFIG = {
  l1ChainId: sepolia.id, // Sepolia
  l2ChainId: haqqTestethic.id,
  l2BlockTime: 3,
  batchInboxAddress: '0xff94b3795acce6d3691fb4538646a91561e95e7d',
  eip1559Denominator: 50,
  eip1559DenominatorCanyon: 250,
  eip1559Elasticity: 6,
  operatorFeeScalar: 0,
  operatorFeeConstant: 0,
};

export const L1_CHAINS = [sepolia];
export const L2_CHAINS = [haqqTestethic];

export const getTxExplorerUrl = (hash: string, chainId: number) => {
  if (chainId === sepolia.id) {
    // Sepolia
    return `${sepolia.blockExplorers.default.url}tx/${hash}`;
  } else if (chainId === haqqTestethic.id) {
    // HAQQ Devnet
    return `${haqqTestethic.blockExplorers.default.url}tx/${hash}`;
  }
  return '#';
};

export const getAddressExplorerUrl = (address: string, chainId: number) => {
  if (chainId === sepolia.id) {
    // Sepolia
    return `${sepolia.blockExplorers.default.url}address/${address}`;
  } else if (chainId === haqqTestethic.id) {
    // HAQQ Devnet
    return `${haqqTestethic.blockExplorers.default.url}address/${address}`;
  }
  return '#';
};
