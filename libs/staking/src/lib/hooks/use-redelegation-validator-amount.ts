import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '@haqq/shell-shared';

export const useRedelegationValidatorAmount = (
  haqqAddress: string | undefined,
  validatorAddress: string | undefined,
) => {
  const { getRedelegationValidatorAmount } = useCosmosService();

  return useQuery<bigint>({
    queryKey: ['redelegationValidatorAmount', haqqAddress, validatorAddress],
    queryFn: async () => {
      if (!haqqAddress || !validatorAddress) {
        return BigInt(0);
      }
      return getRedelegationValidatorAmount(haqqAddress, validatorAddress);
    },
    enabled: !!haqqAddress && !!validatorAddress,
  });
};
