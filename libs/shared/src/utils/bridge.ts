import { sepolia } from 'viem/chains';

const haqqDevnet1RpcUrl = 'http://65.21.69.176:8545/';
export const haqqDevnet1 = {
  id: 64322, // 0xfb42 in hex
  name: 'HAQQ L2',
  nativeCurrency: {
    decimals: 18,
    name: 'Islamic Coin',
    symbol: 'ISLM',
  },
  rpcUrls: {
    default: {
      http: [haqqDevnet1RpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'HAQQ Explorer',
      url: 'https://explorer.devnet1.dev.haqq.network/',
      apiUrl: 'https://explorer.devnet1.dev.haqq.network/api',
    },
  },
};

export const L1_CHAINS = [sepolia];
export const L2_CHAINS = [haqqDevnet1];

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
  ],
};

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

export const HAQQ_DEVNET1_CONFIG: NetworkConfig = {
  name: 'HAQQ L2',
  rpcUrl: haqqDevnet1RpcUrl,
  explorerUrl: 'https://explorer.devnet1.dev.haqq.network/',
};

export const L1_STANDARD_BRIDGE_ADDRESS =
  '0x95f23da653971217bff7a22508606e52c21b1cdf';

// Governance token configuration
export const GOVERNANCE_TOKEN_CONFIG = {
  symbol: 'gISLM',
  name: 'Islamic Coin Governance',
  owner: '0xBaaa30f95cf147522F44FBBfAbAD1e1763824b76',
};

// Chain configuration constants
export const CHAIN_CONFIG = {
  l1ChainId: 11155111, // Sepolia
  l2ChainId: 64322, // 0xfb42
  l2BlockTime: 3,
  batchInboxAddress: '0xff3108624ddfd2f18f41fb62ccbbcdc3b1d6e39f',
  eip1559Denominator: 50,
  eip1559DenominatorCanyon: 250,
  eip1559Elasticity: 6,
  operatorFeeScalar: 0,
  operatorFeeConstant: 0,
};

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
  superchainDeployment: {
    proxyAdminAddress: string;
    superchainConfigProxyAddress: string;
    superchainConfigImplAddress: string;
    protocolVersionsProxyAddress: string;
    protocolVersionsImplAddress: string;
  };
  opChainDeployment: {
    proxyAdminAddress: string;
    addressManagerAddress: string;
    l1ERC721BridgeProxyAddress: string;
    systemConfigProxyAddress: string;
    optimismMintableERC20FactoryProxyAddress: string;
    l1StandardBridgeProxyAddress: string;
    l1CrossDomainMessengerProxyAddress: string;
    optimismPortalProxyAddress: string;
    ethLockboxProxyAddress: string;
    disputeGameFactoryProxyAddress: string;
    anchorStateRegistryProxyAddress: string;
    anchorStateRegistryImplAddress: string;
    faultDisputeGameAddress: string;
    permissionedDisputeGameAddress: string;
    delayedWETHPermissionedGameProxyAddress: string;
    dataAvailabilityChallengeProxyAddress: string;
    dataAvailabilityChallengeImplAddress: string;
  };
  implementationsDeployment: {
    opcmAddress: string;
    delayedWETHImplAddress: string;
    optimismPortalImplAddress: string;
    ethLockboxImplAddress: string;
    preimageOracleSingletonAddress: string;
    mipsSingletonAddress: string;
    systemConfigImplAddress: string;
    l1CrossDomainMessengerImplAddress: string;
    l1ERC721BridgeImplAddress: string;
    l1StandardBridgeImplAddress: string;
    optimismMintableERC20FactoryImplAddress: string;
    disputeGameFactoryImplAddress: string;
  };
} = {
  superchainDeployment: {
    proxyAdminAddress: '0x415e42e8391047ced2e1cb779e9558cc7005b41e',
    superchainConfigProxyAddress: '0x5e1354714853acee2c4dfb12bfbc819829236b62',
    superchainConfigImplAddress: '0x4da82a327773965b8d4d85fa3db8249b387458e7',
    protocolVersionsProxyAddress: '0xaa20fe2b94d752de2b963787630614545041a0b0',
    protocolVersionsImplAddress: '0x37e15e4d6dffa9e5e320ee1ec036922e563cb76c',
  },
  opChainDeployment: {
    proxyAdminAddress: '0x65ab9dc0ee4fbb8b7be91e0d80afde9d1127713d',
    addressManagerAddress: '0x69290dc5aa94b737d896731049b6a0e8c08c43c6',
    l1ERC721BridgeProxyAddress: '0xeb99f82e0f244d0c6c565d95fb3b97cc474998b2',
    systemConfigProxyAddress: '0xc510c91e359958bb96a128235bd188d209f117e2',
    optimismMintableERC20FactoryProxyAddress:
      '0x76b3a6e0ad683dd48d723a284a3f57b012df484f', // 
    l1StandardBridgeProxyAddress: '0x95f23da653971217bff7a22508606e52c21b1cdf',
    l1CrossDomainMessengerProxyAddress:
      '0xd62594927e587af7b3e99980032941abc69f3528',
    optimismPortalProxyAddress: '0x6e5acfca11b12232b50591b40988e0acadb1cbb0',
    ethLockboxProxyAddress: '0x0000000000000000000000000000000000000000',
    disputeGameFactoryProxyAddress:
      '0xad440db2b4f8c67e1181e050d509812fbf1c59bf',
    anchorStateRegistryProxyAddress:
      '0x86a4f10d2b0e87c9af98fcd66a91bcc094087e97',
    anchorStateRegistryImplAddress:
      '0x0000000000000000000000000000000000000000',
    faultDisputeGameAddress: '0x0000000000000000000000000000000000000000',
    permissionedDisputeGameAddress:
      '0xa6a95df0a228935dd54433e519d9021bd11767d5',
    delayedWETHPermissionedGameProxyAddress:
      '0xf03a9631a215f385fa1bee0831bfbf5cfcb795d5',
    dataAvailabilityChallengeProxyAddress:
      '0x0000000000000000000000000000000000000000',
    dataAvailabilityChallengeImplAddress:
      '0x0000000000000000000000000000000000000000',
  },
  implementationsDeployment: {
    opcmAddress: '0x123f94fce34bb6f67b1b80beb8389ff4bc34835f',
    delayedWETHImplAddress: '0x5e40b9231b86984b5150507046e354dbfbed3d9e',
    optimismPortalImplAddress: '0xb443da3e07052204a02d630a8933dac05a0d6fb4',
    ethLockboxImplAddress: '0x0000000000000000000000000000000000000000',
    preimageOracleSingletonAddress:
      '0x1fb8cdfc6831fc866ed9c51af8817da5c287add3',
    mipsSingletonAddress: '0xf027f4a985560fb13324e943edf55ad6f1d15dc1',
    systemConfigImplAddress: '0x340f923e5c7cbb2171146f64169ec9d5a9ffe647',
    l1CrossDomainMessengerImplAddress:
      '0x5d5a095665886119693f0b41d8dfee78da033e8b',
    l1ERC721BridgeImplAddress: '0x7ae1d3bd877a4c5ca257404ce26be93a02c98013',
    l1StandardBridgeImplAddress: '0x0b09ba359a106c9ea3b181cbc5f394570c7d2a7a',
    optimismMintableERC20FactoryImplAddress:
      '0x5493f4677a186f64805fe7317d6993ba4863988f',
    disputeGameFactoryImplAddress: '0x4bba758f006ef09402ef31724203f316ab74e4a0',
  },
};

// Additional configuration from TOML
export const DEPLOYMENT_CONFIG = {
  configType: 'standard-overrides',
  l1ChainId: 11155111, // Sepolia
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
