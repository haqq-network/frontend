import { useAddress } from '@haqq/shared';
import { AccountPageComponent } from './AccountPage';
import { PendingPage } from './PendingPage';

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
