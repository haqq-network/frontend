import { Validator } from '@evmos/provider';

export function sortValidatorsByToken(validators: Validator[]) {
  return validators.sort((valA: Validator, valB: Validator) => {
    return Number.parseInt(valB.tokens, 10) - Number.parseInt(valA.tokens, 10);
  });
}

export function randomSort<T>(arr: T[]): T[] {
  const shuffledArray = [...arr];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
}

export function sortValidatorsByName(a: Validator, b: Validator) {
  return a.description.moniker.localeCompare(b.description.moniker);
}

export function sortValidatorsByStatus(a: Validator, b: Validator) {
  return a.jailed === b.jailed ? 0 : a.jailed ? 1 : -1;
}

export function sortValidatorsByFee(a: Validator, b: Validator) {
  return (
    Number.parseFloat(b.commission.commission_rates.rate) -
    Number.parseFloat(a.commission.commission_rates.rate)
  );
}

export function sortValidatorsByVotingPower(a: Validator, b: Validator) {
  return Number.parseFloat(b.tokens) - Number.parseFloat(a.tokens);
}

export function createSortValidatorsByVotingPowerPercent(totalStaked: number) {
  return (a: Validator, b: Validator) => {
    return (
      (Number.parseFloat(b.tokens) / totalStaked) * 100 -
      (Number.parseFloat(a.tokens) / totalStaked) * 100
    );
  };
}

export function createSortValidatorsByStakedOrReward(
  getSortValues: (operatorAddreses: Array<string>) => Array<number>,
) {
  return (a: Validator, b: Validator) => {
    const delegations = getSortValues([a.operator_address, b.operator_address]);

    const aAmount = delegations[0];
    const bAmount = delegations[1];

    return bAmount - aAmount;
  };
}
