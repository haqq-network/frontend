import { ValidatorListItemMobile } from './validator-list-item-mobile';

export default {
  title: 'shell/ui-kit/validator-list-item-mobile',
  parameters: {
    // layout: 'centered',
  },
};

export const Active = () => {
  return (
    <ValidatorListItemMobile
      fee={'10%'}
      name="ActiveVal"
      reward={100}
      staked={1000}
      status="active"
      votingPower={120000000}
      votingPowerPercent={25}
    />
  );
};

export const Jailed = () => {
  return (
    <ValidatorListItemMobile
      fee={'12%'}
      name="JailedVal"
      reward={100}
      staked={1000}
      status="jailed"
      votingPower={120000000}
      votingPowerPercent={25}
    />
  );
};

export const Inactive = () => {
  return (
    <ValidatorListItemMobile
      fee={'11%'}
      name="InactiveVal"
      reward={100}
      staked={1000}
      status="inactive"
      votingPower={120000000}
      votingPowerPercent={25}
    />
  );
};
