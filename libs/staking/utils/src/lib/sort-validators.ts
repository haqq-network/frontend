import { Validator } from '@evmos/provider';

export function sortValidatorsByToken(validators: Validator[]) {
  return validators.sort((valA: Validator, valB: Validator) => {
    return Number.parseInt(valB.tokens, 10) - Number.parseInt(valA.tokens, 10);
  });
}
