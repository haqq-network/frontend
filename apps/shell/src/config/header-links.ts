import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';

export const headerLinks: {
  href: string;
  label: string;
  chains: number[];
}[] = [
  // { href: '/', label: 'Home', chains: [haqqMainnet.id, haqqTestedge2.id] },
  {
    href: '/staking',
    label: 'Staking',
    chains: [haqqMainnet.id, haqqTestedge2.id],
  },
  {
    href: '/governance',
    label: 'Governance',
    chains: [haqqMainnet.id, haqqTestedge2.id],
  },
  {
    href: '/authz',
    label: 'Authz',
    chains: [haqqMainnet.id, haqqTestedge2.id],
  },
  { href: '/faucet', label: 'Faucet', chains: [haqqTestedge2.id] },
];
