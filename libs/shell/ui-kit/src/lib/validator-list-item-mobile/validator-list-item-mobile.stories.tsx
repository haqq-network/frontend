import { Router } from 'react-router-dom';
import { ValidatorListItemMobile } from './validator-list-item-mobile';

export default {
  title: 'shell/ui-kit/validator-list-item-mobile',
  parameters: {
    layout: 'centered',
  },
};

export const Active = () => {
  return (
    <Router location={''} navigator={''}>
      <ValidatorListItemMobile
        address="haqqvaloper1tag22x87340up4xkazt6f5dk8z8x23nmq2d06q"
        fee={10}
        name="ActiveVal"
        reward={100}
        staked={1000}
        status="BOND_STATUS_BONDED"
        votingPower={120000000}
        votingPowerPercent={25}
      />
    </Router>
  );
};

export const Jailed = () => {
  return (
    <Router location={''} navigator={''}>
      <ValidatorListItemMobile
        address="haqqvaloper1tag22x87340up4xkazt6f5dk8z8x23nmq2d06q"
        fee={12}
        jailed
        name="JailedVal"
        reward={100}
        staked={1000}
        votingPower={120000000}
        votingPowerPercent={25}
      />
    </Router>
  );
};

export const Inactive = () => {
  return (
    <Router location={''} navigator={''}>
      <ValidatorListItemMobile
        address="haqqvaloper1tag22x87340up4xkazt6f5dk8z8x23nmq2d06q"
        fee={11}
        name="InactiveVal"
        reward={100}
        staked={1000}
        status="BOND_STATUS_UNBONDED"
        votingPower={120000000}
        votingPowerPercent={25}
      />
    </Router>
  );
};
