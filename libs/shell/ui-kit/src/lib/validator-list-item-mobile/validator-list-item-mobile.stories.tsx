import { ValidatorListItemMobile } from './validator-list-item-mobile';

export default {
  title: 'shell/ui-kit/validator-list-item-mobile',
  parameters: {
    layout: 'centered',
  },
};

export const Default = () => {
  const stakingPool = 53397150014.54143;
  const validator = {
    operator_address: 'haqqvaloper18xa2e2z4ndmgef9a7c7lj00etutw2dafyyhdkx',
    consensus_pubkey: {
      '@type': '/cosmos.crypto.ed25519.PubKey',
      key: 'oddw5eWjHnP8ymfMM4nkb+cB0vebA3STKIPUADXCyx0=',
    },
    jailed: false,
    status: 'BOND_STATUS_BONDED',
    tokens: '12209530634048454401992834211',
    delegator_shares: '14484395474234476265703469022.452914368020086907',
    description: {
      moniker: 'val01',
      identity: '',
      website: '',
      security_contact: '',
      details: '',
    },
    unbonding_height: '1816048',
    unbonding_time: '2023-02-02T09:57:23.086714574Z',
    commission: {
      commission_rates: {
        rate: '0.100000000000000000',
        max_rate: '0.200000000000000000',
        max_change_rate: '0.010000000000000000',
      },
      update_time: '2022-09-09T13:00:00Z',
    },
    min_self_delegation: '1',
  };
  const delegation = {
    delegation: {
      delegator_address: 'haqq1vn0ludw6clzwxg6tdqxnzkxcwj6t34gj0vg43g',
      validator_address: 'haqqvaloper18xa2e2z4ndmgef9a7c7lj00etutw2dafyyhdkx',
      shares: '9557487464119541945.986652783152507000',
    },
    balance: {
      denom: 'aISLM',
      amount: '8056424321282832799',
    },
  };
  const reward = {
    validator_address: 'haqqvaloper18xa2e2z4ndmgef9a7c7lj00etutw2dafyyhdkx',
    reward: [
      {
        denom: 'aISLM',
        amount: '2700031527588484633.412799778322221285',
      },
    ],
  };

  return (
    <ValidatorListItemMobile
      stakingPool={stakingPool}
      validator={validator}
      delegation={delegation}
      reward={reward}
    />
  );
};
