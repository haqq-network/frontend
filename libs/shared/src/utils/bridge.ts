import { mainnet } from 'viem/chains';
import { IBridgeAddresses } from './common-bridge-utils';

const haqqEthiqRpcUrl = 'https://rpc.internal.ethiq.network/';

export const ETHIQ_BRIDGE_ADDRESSES: IBridgeAddresses = {
  SuperchainProxyAdminImpl: '0x543ba4aadbab8f9025686bd03993043599c6fb04',
  SuperchainConfigProxy: '0x95703e0982140d16f8eba6d158fccede42f04a4c',
  SuperchainConfigImpl: '0xb08cc720f511062537ca78bdb0ae691f04f5a957',
  ProtocolVersionsProxy: '0x8062abc286f5e7d9428a0ccb9abd71e50d93b935',
  ProtocolVersionsImpl: '0x37e15e4d6dffa9e5e320ee1ec036922e563cb76c',
  OpcmImpl: '0xfa1ef97fb02b0da2ee2346b8e310907ab5519449',
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
  OpChainProxyAdminImpl: '0x004ea6bad47a7b51cb248e17b39b1a53cac663c0',
  OptimismPortalProxy: '0xea857195ff569a0c623464e1a3062dd398d53046',
  AddressManagerImpl: '0x5bc146f89c67f1fa4334efb689a4a926b521ac0c',
  L1Erc721BridgeProxy: '0xfb96b6c6a70ed0e1e1f9b26cbaf85f2ecbf26aec',
  SystemConfigProxy: '0x3f715f77cc105fca0936f479bded4a035eefe974',
  OptimismMintableErc20FactoryProxy:
    '0x2045bc5f56e5b40978bab717c274aa2db9ea019d',
  L1StandardBridgeProxy: '0xfb30129241e7520e66b96426259e95359c3e2800',
  L1CrossDomainMessengerProxy: '0xad4e4387b7f53b326d0d797f5342a120e8b427d2',
  EthLockboxProxy: '0xe26cd6ffdbc21f7294cf56245162be431b17c8e5',
  DisputeGameFactoryProxy: '0xd68f5ce839e1325401a9deab56fa1c14cddb1cea',
  AnchorStateRegistryProxy: '0x159725154956a4097afdca285e4684764d7a02a5',
  FaultDisputeGameImpl: '0x0000000000000000000000000000000000000000',
  PermissionedDisputeGameImpl: '0xe85f5174c2043444aa09141885d8d72b9b175d81',
  DelayedWethPermissionedGameProxy:
    '0xfbc084a037d510d1cb1d1aac08e010ecd8a42f5e',
  DelayedWethPermissionlessGameProxy:
    '0x0000000000000000000000000000000000000000',
  AltDAChallengeProxy: '0x0000000000000000000000000000000000000000',
  AltDAChallengeImpl: '0x0000000000000000000000000000000000000000',
  L2OutputOracleProxy: '0x0000000000000000000000000000000000000000',
};

export const L1_STANDARD_MAINNET_BRIDGE_ADDRESS =
  ETHIQ_BRIDGE_ADDRESSES.L1StandardBridgeProxy;

export const haqqEthiq = {
  id: 30303,
  name: 'Ethiq',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [haqqEthiqRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'HAQQ Ethiq',
      url: 'https://explorer.ethiq.network/',
      apiUrl: 'https://explorer.ethiq.network/api',
    },
  },
  contracts: {
    portal: {
      [mainnet.id]: {
        address: ETHIQ_BRIDGE_ADDRESSES.OptimismPortalProxy as `0x${string}`,
      },
    },
    disputeGameFactory: {
      [mainnet.id]: {
        address:
          ETHIQ_BRIDGE_ADDRESSES.DisputeGameFactoryProxy as `0x${string}`,
      },
    },
    l2OutputOracle: {
      [mainnet.id]: {
        // deprecated https://docs.optimism.io/stack/smart-contracts/smart-contracts
        address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Placeholder
      },
    },
  },
};
