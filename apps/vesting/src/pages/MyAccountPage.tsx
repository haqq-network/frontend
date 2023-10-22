import { useAddress } from '@haqq/shared';
import { PendingPage } from './PendingPage';
import { AccountPageComponent } from './AccountPage';

export function AccountPage() {
  const { ethAddress, haqqAddress } = useAddress();

  if (!ethAddress || !haqqAddress) {
    return <PendingPage />;
  }

  return (
    <AccountPageComponent ethAddress={ethAddress} haqqAddress={haqqAddress} />
  );
}

export { AccountPage as default };
