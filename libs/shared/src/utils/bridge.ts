import { sepolia } from 'viem/chains';

export const haqqDevnet1 = {
  id: 64322,
  name: 'HAQQ Devnet 1',
  nativeCurrency: {
    decimals: 18,
    name: 'Islamic Coin',
    symbol: 'ISLMT',
  },
  rpcUrls: {
    default: {
      http: ['http://65.21.69.176:8545/'],
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
  name: 'HAQQ Devnet1',
  rpcUrl: 'http://65.21.69.176:8545/',
  explorerUrl: 'https://explorer.devnet1.dev.haqq.network/',
};

export const L1_STANDARD_BRIDGE_ADDRESS =
  '0x4b317e25e14038ad8e9a35c1da1d2bc73859c7c7';

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
    proxyAdminAddress: '0x20d25557876372ae6cb3cb41090de8728424846c',
    superchainConfigProxyAddress: '0x83e5881a9c31821ccf5f6b32af670b70ff74e689',
    superchainConfigImplAddress: '0x4da82a327773965b8d4d85fa3db8249b387458e7',
    protocolVersionsProxyAddress: '0x9d777cd3dd4181619f58afd07e52aab5513ac402',
    protocolVersionsImplAddress: '0x37e15e4d6dffa9e5e320ee1ec036922e563cb76c',
  },
  opChainDeployment: {
    proxyAdminAddress: '0x8bc1b2315fc54ae89f7e56655db1e25dcebfb499',
    addressManagerAddress: '0x827156e0248a6a84e553a228109267b1b07d0fd4',
    l1ERC721BridgeProxyAddress: '0x7fd6235f5c4b5bc08d5b7b9b607f0ea77d863566',
    systemConfigProxyAddress: '0x517f3ef01e0bab4b529e7af48b515b9c9c0627e3',
    optimismMintableERC20FactoryProxyAddress:
      '0x1487603f8fc404e8a3d6bd866800e300b18e1a11',
    l1StandardBridgeProxyAddress: '0x4b317e25e14038ad8e9a35c1da1d2bc73859c7c7',
    l1CrossDomainMessengerProxyAddress:
      '0x8d489e317a5aebf9ed3b83833895b1303332904b',
    optimismPortalProxyAddress: '0x2606fe1d4f55ee697f795cef525b0293815a8928',
    ethLockboxProxyAddress: '0x0000000000000000000000000000000000000000',
    disputeGameFactoryProxyAddress:
      '0x0db4b1cb596ffe5d4ccc784148a5e1bee8d0c817',
    anchorStateRegistryProxyAddress:
      '0xbe450e4af0ad07a993f1d3b3ea4a1e5f2c53190c',
    anchorStateRegistryImplAddress:
      '0x0000000000000000000000000000000000000000',
    faultDisputeGameAddress: '0x0000000000000000000000000000000000000000',
    permissionedDisputeGameAddress:
      '0xcddda2c21a3d8c4b98954e40efac6fd6fa1db1ee',
    delayedWETHPermissionedGameProxyAddress:
      '0xd97cd3dc8261f936c9d730edc73137bd1b7ece83',
    dataAvailabilityChallengeProxyAddress:
      '0x0000000000000000000000000000000000000000',
    dataAvailabilityChallengeImplAddress:
      '0x0000000000000000000000000000000000000000',
  },
  implementationsDeployment: {
    opcmAddress: '0xb9cb142092b9adbbcecab8c39101d2912bf8822b',
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
