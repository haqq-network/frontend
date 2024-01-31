import { Validator } from '@evmos/provider';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';

export function splitValidators(validatorsList: Validator[]) {
  const active: Validator[] = [];
  const inactive: Validator[] = [];
  const jailed: Validator[] = [];

  if (validatorsList?.length) {
    for (const validator of validatorsList) {
      if (validator.jailed) {
        jailed.push(validator);
      } else if (bondStatusFromJSON(validator.status) === 3) {
        active.push(validator);
      } else {
        inactive.push(validator);
      }
    }
  }

  return {
    active,
    inactive,
    jailed,
  };
}
