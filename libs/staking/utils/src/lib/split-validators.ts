import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';

// TODO: add correct typings
export function splitValidators(validatorsList: any[]) {
  const active: any[] = [];
  const inactive: any[] = [];
  const jailed: any[] = [];

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
