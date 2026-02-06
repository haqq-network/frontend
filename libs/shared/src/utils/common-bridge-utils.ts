import { haqqTestedge2, sepolia } from 'viem/chains';
import { haqqEthiq } from './bridge';
import { haqqTestethiq } from './bridge-testethiq';
import { mainnet } from './ethereum-mainnet';

export interface IBridgeAddresses {
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
}

export const getAddressExplorerUrl = (address: string, chainId: number) => {
  if (chainId === sepolia.id) {
    // Sepolia
    return `${sepolia.blockExplorers.default.url}/address/${address}`;
  } else if (chainId === haqqTestethiq.id) {
    // HAQQ Devnet
    return `${haqqTestethiq.blockExplorers.default.url}/address/${address}`;
  } else if (chainId === mainnet.id) {
    // Mainnet
    return `${mainnet.blockExplorers.default.url}/address/${address}`;
  } else if (chainId === haqqEthiq.id) {
    // Ethiq
    return `${haqqEthiq.blockExplorers.default.url}/address/${address}`;
  }
  return '#';
};

export const getTxExplorerUrl = (hash: string, chainId: number) => {
  if (chainId === sepolia.id) {
    // Sepolia
    return `${sepolia.blockExplorers.default.url}/tx/${hash}`;
  } else if (chainId === haqqTestethiq.id) {
    // HAQQ Devnet
    return `${haqqTestethiq.blockExplorers.default.url}/tx/${hash}`;
  } else if (chainId === mainnet.id) {
    // Mainnet
    return `${mainnet.blockExplorers.default.url}/tx/${hash}`;
  } else if (chainId === haqqEthiq.id) {
    // Ethiq
    return `${haqqEthiq.blockExplorers.default.url}/tx/${hash}`;
  }
  return '#';
};

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
  [mainnet.id]: [
    {
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    {
      symbol: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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

// Chain configuration constants
export const CHAIN_CONFIG = {
  l1ChainId: mainnet.id, // Mainnet
  l1TestChainId: sepolia.id, // Sepolia
  l2ChainId: haqqEthiq.id,
  l2TestChainId: haqqTestethiq.id,
};

//  l2StandardBridgeProxyAddress https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/withdrawOptimismERC20.ts#L90
export const L2_STANDARD_BRIDGE_ADDRESS =
  '0x4200000000000000000000000000000000000010';

export const L2_OPTIMISM_MINTABLE_ERC20_FACTORY_ADDRESS =
  '0x4200000000000000000000000000000000000012';

export const FAUCET_CHAINS = [haqqTestedge2.id, haqqTestethiq.id, sepolia.id];
