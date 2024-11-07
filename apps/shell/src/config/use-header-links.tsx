import { useTranslate } from '@tolgee/react';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import { HeaderLink } from '@haqq/shell-ui-kit';

export const useHeaderLinks = (): HeaderLink[] => {
  const { t } = useTranslate('common');
  return [
    {
      type: 'link',
      label: t('uc-dao', 'UC DAO'),
      href: '/uc-dao',
      chains: [haqqMainnet.id, haqqTestedge2.id],
    },
    {
      type: 'link',
      label: t('staking', 'Staking'),
      href: '/staking',
      chains: [haqqMainnet.id, haqqTestedge2.id],
    },
    {
      type: 'link',
      label: t('governance', 'Governance'),
      href: '/governance',
      chains: [haqqMainnet.id, haqqTestedge2.id],
    },
    {
      type: 'dropdown',
      label: t('tools', 'Tools'),
      children: [
        {
          type: 'link',
          label: t('authz', 'Authz'),
          href: '/authz',
          chains: [haqqMainnet.id, haqqTestedge2.id],
        },
        {
          type: 'link',
          label: t('faucet', 'Faucet'),
          href: '/faucet',
          chains: [haqqTestedge2.id],
        },
      ],
    },
    {
      type: 'dropdown',
      label: t('utils', 'Utils'),
      children: [
        {
          type: 'link',
          label: t('address-conversion-title', 'Address conversion', {
            ns: 'common',
          }),
          href: '/utils/address-conversion',
          chains: [haqqMainnet.id, haqqTestedge2.id],
        },
      ],
    },
  ];
};
