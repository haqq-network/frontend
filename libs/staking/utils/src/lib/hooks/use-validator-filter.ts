import { useMemo } from 'react';
import { Validator } from '@evmos/provider';

export function containsSubstring(source: string, substring: string): boolean {
  return source.toLowerCase().includes(substring.toLowerCase());
}

export function useFilteredValidators(
  validators: Validator[],
  filter: string | undefined,
): Validator[] {
  return useMemo(() => {
    if (!filter || filter === '') {
      return validators;
    }

    return validators.filter((validator) => {
      return containsSubstring(validator.description.moniker, filter);
    });
  }, [validators, filter]);
}
