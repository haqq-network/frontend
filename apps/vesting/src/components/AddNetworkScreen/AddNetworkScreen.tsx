import { ReactElement, ReactNode } from 'react';
import { Button } from '../Button/Button';
import { AlertWithDetails } from '../modals/AlertWithDetails/AlertWithDetails';
import { Heading, Text } from '../Typography/Typography';
import { useOnboarding } from '../../OnboardingContainer';
import { getChainParams, useConfig } from '@haqq/shared';

function AddNetworkDetailsItem({
  title,
  value,
}: {
  title: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <Text bold>{title}</Text>
      <Text color="light">{value}</Text>
    </div>
  );
}

export function AddNetworkScreen(): ReactElement {
  const { chainName } = useConfig();
  const chain = getChainParams(chainName);
  const {
    errors: { addNetworkError },
    clearError,
    addNetwork,
  } = useOnboarding();

  return (
    <div className="flex flex-col space-y-8">
      <Heading level={2}>Add a network</Heading>

      <div>
        <Text color="light">
          Seems like you haven&apos;t add our network to MetaMask. <br />
          You can do it by pressing &quot;Add network&quot; button bellow.
        </Text>
      </div>

      <div className="flex flex-col space-y-6 rounded-[12px] bg-white p-[20px] shadow-lg">
        <AddNetworkDetailsItem title="Network name" value={chain.name} />
        <AddNetworkDetailsItem
          title="Network url"
          value={chain.ethRpcEndpoint}
        />
        <AddNetworkDetailsItem title="Chain ID" value={chain.id} />
      </div>

      <div className="md:text-right">
        <Button onClick={addNetwork} className="min-w-[180px]">
          Add network
        </Button>
      </div>

      <AlertWithDetails
        isOpen={addNetworkError !== undefined}
        title="Add new network error"
        message="Something went wrong and we can't add new network to your wallet"
        details={addNetworkError?.message}
        onClose={() => clearError('addNetworkError')}
      />
    </div>
  );
}
