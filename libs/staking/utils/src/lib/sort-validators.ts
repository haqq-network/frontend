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
