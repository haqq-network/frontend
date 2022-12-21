// TODO: add correct typings
export function sortValidatorsByToken(validators: any[]) {
  return validators.sort((valA: any, valB: any) => {
    return Number.parseInt(valB.tokens, 10) - Number.parseInt(valA.tokens, 10);
  });
}
