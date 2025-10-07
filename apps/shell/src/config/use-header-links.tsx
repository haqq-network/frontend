import { useTranslate } from '@tolgee/react';
import { haqqTestedge2 } from 'wagmi/chains';
import { HeaderLink } from '@haqq/shell-ui-kit';
import { supportedChains } from './wagmi-config';

const allowedChains = supportedChains.map((chain) => {
  return chain.id;
});

export const useHeaderLinks = (): HeaderLink[] => {
  const { t } = useTranslate('common');
  return [
    {
      type: 'link',
      label: t('bridge', 'Bridge'),
      href: '/bridge',
      chains: allowedChains,
    },
    {
      type: 'link',
      label: t('uc-dao', 'UC DAO'),
      href: '/uc-dao',
      chains: allowedChains,
    },
    {
      type: 'link',
      label: t('staking', 'Staking'),
      href: '/staking',
      chains: allowedChains,
    },
    {
      type: 'link',
      label: t('governance', 'Governance'),
      href: '/governance',
      chains: allowedChains,
    },
    {
      type: 'link',
      label: t('authz', 'Authz'),
      href: '/authz',
      chains: allowedChains,
    },
    {
      type: 'dropdown',
      label: t('tools', 'Tools'),
      children: [
        {
          type: 'link',
          label: t('faucet', 'Faucet'),
          href: '/faucet',
          chains: [haqqTestedge2.id],
        },
        {
          type: 'link',
          label: t('address-conversion-title', 'Address conversion', {
            ns: 'common',
          }),
          href: '/utils/address-conversion',
          chains: allowedChains,
        },
      ],
    },
  ];
};
