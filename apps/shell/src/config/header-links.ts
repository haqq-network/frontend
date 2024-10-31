import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import { HeaderLink } from '@haqq/shell-ui-kit';

export const headerLinks: HeaderLink[] = [
  {
    type: 'link',
    label: 'UC DAO',
    href: '/uc-dao',
    chains: [haqqMainnet.id, haqqTestedge2.id],
  },
  {
    type: 'link',
    label: 'Staking',
    href: '/staking',
    chains: [haqqMainnet.id, haqqTestedge2.id],
  },
  {
    type: 'link',
    label: 'Governance',
    href: '/governance',
    chains: [haqqMainnet.id, haqqTestedge2.id],
  },
  {
    type: 'dropdown',
    label: 'Tools',
    children: [
      {
        type: 'link',
        label: 'Authz',
        href: '/authz',
        chains: [haqqMainnet.id, haqqTestedge2.id],
      },
      {
        type: 'link',
        label: 'Faucet',
        href: '/faucet',
        chains: [haqqTestedge2.id],
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Utils',
    children: [
      {
        type: 'link',
        label: 'Address conversion',
        href: '/utils/address-conversion',
        chains: [haqqMainnet.id, haqqTestedge2.id],
      },
    ],
  },
];
