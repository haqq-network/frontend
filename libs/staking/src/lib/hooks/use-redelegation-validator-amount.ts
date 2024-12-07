import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '@haqq/shell-shared';

export const useRedelegationValidatorAmount = (
  haqqAddress: string | undefined,
  validatorAddress: string | undefined,
) => {
  const { getRedelegationValidatorAmount } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery<bigint>({
    queryKey: [
      chain.id,
      'redelegation-validator-amount',
      haqqAddress,
      validatorAddress,
    ],
    queryFn: async () => {
      if (!haqqAddress || !validatorAddress) {
        return BigInt(0);
      }
      return getRedelegationValidatorAmount(haqqAddress, validatorAddress);
    },
    enabled: !!haqqAddress && !!validatorAddress,
  });
};
