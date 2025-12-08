import { haqqTestedge2, sepolia } from 'viem/chains';

const haqqTestethiqRpcUrl = 'https://rpc.testnet.ethiq.network/';

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
  OpcmStandardValidatorImpl: string;
  DelayedWethImpl: string;
  OptimismPortalImpl: string;
  OptimismPortalInteropImpl: string;
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
  SuperchainProxyAdminImpl: '0x189abaaaa82dfc015a588a7dbad6f13b1d3485bc',
  SuperchainConfigProxy: '0xc2be75506d5724086deb7245bd260cc9753911be',
  SuperchainConfigImpl: '0xb08cc720f511062537ca78bdb0ae691f04f5a957',
  ProtocolVersionsProxy: '0x79add5713b383daa0a138d3c4780c7a1804a8090',
  ProtocolVersionsImpl: '0x37e15e4d6dffa9e5e320ee1ec036922e563cb76c',
  OpcmImpl: '0xc69e4c24db479191676611a25d977203c3bdca62',
  OpcmContractsContainerImpl: '0x0000000000000000000000000000000000000000',
  OpcmGameTypeAdderImpl: '0x0000000000000000000000000000000000000000',
  OpcmDeployerImpl: '0x0000000000000000000000000000000000000000',
  OpcmUpgraderImpl: '0x0000000000000000000000000000000000000000',
  OpcmInteropMigratorImpl: '0x0000000000000000000000000000000000000000',
  OpcmStandardValidatorImpl: '0x0000000000000000000000000000000000000000',
  DelayedWethImpl: '0x33dadc2d1aa9bb613a7ae6b28425ea00d44c6998',
  OptimismPortalImpl: '0x7cf803296662e8c72a6c1d6450572209acf7f202',
  OptimismPortalInteropImpl: '0x5cb365a10e99335d8fedfa225aac5e21287302dd',
  EthLockboxImpl: '0x784d2f03593a42a6e4676a012762f18775ecbbe6',
  PreimageOracleImpl: '0x1fb8cdfc6831fc866ed9c51af8817da5c287add3',
  MipsImpl: '0x6463dee3828677f6270d83d45408044fc5edb908',
  SystemConfigImpl: '0x2fa28989fc559836e9d66dff3010c7f7f41c65ed',
  L1CrossDomainMessengerImpl: '0xb686f13aff1e427a1f993f29ab0f2e7383729fe0',
  L1Erc721BridgeImpl: '0x74f1ac50eb0be98853805d381c884f5f9abdecf9',
  L1StandardBridgeImpl: '0x61525eaacddb97d9184afc205827e6a4fd0bf62a',
  OptimismMintableErc20FactoryImpl:
    '0x8ee6fb13c6c9a7e401531168e196fbf8b05ceabb',
  DisputeGameFactoryImpl: '0x74fac1d45b98bae058f8f566201c9a81b85c7d50',
  AnchorStateRegistryImpl: '0x0000000000000000000000000000000000000000',
  OpChainProxyAdminImpl: '0xcd9c1ab8aa13c69f72cd68520a353bd54cf5ab18',
  OptimismPortalProxy: '0x5b5f73ebcda96d9c4ca3315497e370c49573cf62',
  AddressManagerImpl: '0x801a839da752289f448e0c9cc3bfb8d861077faa',
  L1Erc721BridgeProxy: '0xfa74bcf421580f5ba021a3f3e270004743fdaa26',
  SystemConfigProxy: '0xb8ad3a6beb0301f057c33f2a039a1044ec4d9bf9',
  OptimismMintableErc20FactoryProxy:
    '0xf197dd37d128b451ed546c0a88153d0eaaf1d7f2',
  L1StandardBridgeProxy: '0x611bc60e604803b4f064810b4630290515bfba8c',
  L1CrossDomainMessengerProxy: '0x96c9dcddc1cfd08ea3848395c390df815d8ec581',
  EthLockboxProxy: '0x879122273ff3ee266fe58a8da8913f01c1065276',
  DisputeGameFactoryProxy: '0xa34af21d8b896ea86bd3c5dd350f04ec8719e9f9',
  AnchorStateRegistryProxy: '0x804bfedd469ff6b5669378d6c82e32517c010136',
  FaultDisputeGameImpl: '0x0000000000000000000000000000000000000000',
  PermissionedDisputeGameImpl: '0x3369335fdc75f5cfd377dc63e9e3c570bbdb2123',
  DelayedWethPermissionedGameProxy:
    '0xca17f9597d2f85db54a603dae9761f180dded6e8',
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

export const haqqTestethiq = {
  id: 853211,
  name: 'Testethiq',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [haqqTestethiqRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'HAQQ Testethiq',
      url: 'https://explorer.testnet.ethiq.network/',
      apiUrl: 'https://explorer.testnet.ethiq.network/api',
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
  l2ChainId: haqqTestethiq.id,
  l2BlockTime: 3,
  batchInboxAddress: '0xff94b3795acce6d3691fb4538646a91561e95e7d',
  eip1559Denominator: 50,
  eip1559DenominatorCanyon: 250,
  eip1559Elasticity: 6,
  operatorFeeScalar: 0,
  operatorFeeConstant: 0,
};

export const L1_CHAINS = [sepolia];
export const L2_CHAINS = [haqqTestethiq];

export const getTxExplorerUrl = (hash: string, chainId: number) => {
  if (chainId === sepolia.id) {
    // Sepolia
    return `${sepolia.blockExplorers.default.url}/tx/${hash}`;
  } else if (chainId === haqqTestethiq.id) {
    // HAQQ Devnet
    return `${haqqTestethiq.blockExplorers.default.url}/tx/${hash}`;
  }
  return '#';
};

export const getAddressExplorerUrl = (address: string, chainId: number) => {
  if (chainId === sepolia.id) {
    // Sepolia
    return `${sepolia.blockExplorers.default.url}/address/${address}`;
  } else if (chainId === haqqTestethiq.id) {
    // HAQQ Devnet
    return `${haqqTestethiq.blockExplorers.default.url}/address/${address}`;
  }
  return '#';
};

export const FAUCET_CHAINS = [haqqTestedge2.id, haqqTestethiq.id, sepolia.id];
