import { useTranslate } from '@tolgee/react';

export const enum ProposalTypes {
  Text = '/cosmos.gov.v1beta1.TextProposal',
  SoftwareUpgrade = '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal',
  CancelSoftwareUpgrade = '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal',
  ParameterChange = '/cosmos.params.v1beta1.ParameterChangeProposal',
  ClientUpdate = '/ibc.core.client.v1.ClientUpdateProposal',
  RegisterCoin = '/evmos.erc20.v1.RegisterCoinProposal',
  RegisterERC20 = '/evmos.erc20.v1.RegisterERC20Proposal',
}

export function useGetProposalTypeText(type: string) {
  const { t } = useTranslate('governance');

  switch (type) {
    case ProposalTypes.Text:
      return t('proposal-types.text', 'Text');

    case ProposalTypes.SoftwareUpgrade:
      return t('proposal-types.software-upgrade', 'Software upgrade');

    case ProposalTypes.CancelSoftwareUpgrade:
      return t(
        'proposal-types.cancel-software-upgrade',
        'Cancel software upgrade',
      );

    case ProposalTypes.ClientUpdate:
      return t('proposal-types.client-update', 'Client update');

    case ProposalTypes.ParameterChange:
      return t('proposal-types.parameter-change', 'Parameter change');

    case ProposalTypes.RegisterCoin:
      return t('proposal-types.register-coin', 'Register coin');

    case ProposalTypes.RegisterERC20:
      return t('proposal-types.register-erc20', 'Register ERC20');

    default:
      return type;
  }
}
