import { useQuery } from '@tanstack/react-query';
import { useChainId } from 'wagmi';
import { chains } from '@haqq/data-access-cosmos';

interface RedelegationResponse {
  redelegation_responses: Array<{
    redelegation: {
      validator_src_address: string;
    };
    entries: Array<{
      balance: string;
    }>;
  }>;
}

export const useRedelegationValidatorAmount = (
  haqqAddress: string | undefined,
  validatorAddress: string | undefined,
) => {
  const chainId = useChainId();

  return useQuery<bigint>({
    queryKey: ['redelegationValidatorAmount', haqqAddress, validatorAddress],
    queryFn: async () => {
      const response = await fetch(
        `${chains[chainId].cosmosRestEndpoint}/cosmos/staking/v1beta1/delegators/${haqqAddress}/redelegations`,
      );
      const data: RedelegationResponse = await response.json();

      const totalBalance = data.redelegation_responses
        .filter((response) => {
          return (
            response.redelegation.validator_src_address === validatorAddress
          );
        })
        .flatMap((response) => {
          return response.entries;
        })
        .reduce((sum, entry) => {
          return sum + BigInt(entry.balance);
        }, BigInt(0));

      return totalBalance;
    },
    enabled: !!haqqAddress && !!validatorAddress,
  });
};
