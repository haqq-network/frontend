import { notFound, useParams } from 'next/navigation';
import { ValidatorDetailsPage } from '@haqq/shell-staking';

export default function ValidatorDetails() {
  const { address } = useParams<{ address: string }>();

  if (!address) {
    return notFound();
  }

  return <ValidatorDetailsPage validatorAddress={address} />;
}
