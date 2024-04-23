import { ChainProperties } from '../types';

export const chains: Record<number, ChainProperties> = {
  121799: {
    id: 121799,
    cosmosChainId: 'haqq_121799-1',
    name: 'HAQQ Localnet',
    network: 'haqq-localnet',
    tmRpcEndpoint: 'http://127.0.0.1:26657',
    cosmosRestEndpoint: 'http://127.0.0.1:1317',
    explorer: {
      evm: 'https://explorer.testedge2.haqq.network',
      cosmos: 'https://testnet.ping.pub/haqq',
    },
  },
  54211: {
    id: 54211,
    cosmosChainId: 'haqq_54211-3',
    name: 'HAQQ Testedge 2',
    network: 'haqq-testedge-2',
    tmRpcEndpoint: 'https://rpc.tm.testedge2.haqq.network',
    cosmosRestEndpoint: 'https://rest.cosmos.testedge2.haqq.network',
    explorer: {
      evm: 'https://explorer.testedge2.haqq.network',
      cosmos: 'https://testnet.ping.pub/haqq',
    },
  },
  11235: {
    id: 11235,
    cosmosChainId: 'haqq_11235-1',
    name: 'HAQQ Mainnet',
    network: 'haqq-mainnet',
    tmRpcEndpoint: 'https://fork-rpc.haqq.sh',
    cosmosRestEndpoint: 'https://fork-lcd.haqq.sh',
    explorer: {
      evm: 'https://explorer.haqq.network',
      cosmos: 'https://ping.pub/haqq',
    },
  },
};
