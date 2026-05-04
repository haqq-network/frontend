import { sepolia } from 'viem/chains';
import { IBridgeAddresses } from './common-bridge-utils';

const haqqDevnet2RpcUrl = 'https://rpc.dev.ethiq.network/';

export const ETHIQ_DEVNET2_BRIDGE_ADDRESSES: IBridgeAddresses = {
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
  OpChainProxyAdminImpl: '0x009ce745bb567e12b86d16593af2b5f19ced50c8',
  OptimismPortalProxy: '0x7380278cfcacc9bbba69ae0c46dccebaaec4e238',
  AddressManagerImpl: '0xd6441c08f11fb332e84b9a3bff5f07b20483a8f5',
  L1Erc721BridgeProxy: '0x76b702bee0754a8ecc7250564afb68e40821faa0',
  SystemConfigProxy: '0x5363f684a625eabe239616e9b9cc37551421afb2',
  OptimismMintableErc20FactoryProxy:
    '0x3e157acceeacce3840fcf869c8f57aad1a6e7bbd',
  L1StandardBridgeProxy: '0x4f39db42466195b2e189371e5ab249fb55d7428b',
  L1CrossDomainMessengerProxy: '0x9a16d244e22a1d28c3d51028cd5577bdad0f2f60',
  EthLockboxProxy: '0xab8b83f4e71fe41bc1133b7e0314c2d97ee7de3d',
  DisputeGameFactoryProxy: '0x9bcdf79c31da59afbe1b5bc5264d440dca32d8a3',
  AnchorStateRegistryProxy: '0x572d71f9d71422bb4e412b879648c8868b687578',
  FaultDisputeGameImpl: '0x0000000000000000000000000000000000000000',
  PermissionedDisputeGameImpl: '0x19799f525ffe8866a2d29f79999daff8e76fa2d8',
  DelayedWethPermissionedGameProxy:
    '0xb9b625a103d00a220fd65929f311a4c48bc021dd',
  DelayedWethPermissionlessGameProxy:
    '0x0000000000000000000000000000000000000000',
  AltDAChallengeProxy: '0x0000000000000000000000000000000000000000',
  AltDAChallengeImpl: '0x0000000000000000000000000000000000000000',
  L2OutputOracleProxy: '0x0000000000000000000000000000000000000000',
};

export const L1_STANDARD_DEVNET2_BRIDGE_ADDRESS =
  ETHIQ_DEVNET2_BRIDGE_ADDRESSES.L1StandardBridgeProxy;

export const haqqDevnet2 = {
  id: 64322,
  name: 'Ethiq Devnet 2',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [haqqDevnet2RpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'HAQQ Devnet 2',
      url: 'https://explorer.dev.ethiq.network/',
      apiUrl: 'https://explorer.dev.ethiq.network/api',
    },
  },
  contracts: {
    portal: {
      [sepolia.id]: {
        address:
          ETHIQ_DEVNET2_BRIDGE_ADDRESSES.OptimismPortalProxy as `0x${string}`,
      },
    },
    disputeGameFactory: {
      [sepolia.id]: {
        address:
          ETHIQ_DEVNET2_BRIDGE_ADDRESSES.DisputeGameFactoryProxy as `0x${string}`,
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
