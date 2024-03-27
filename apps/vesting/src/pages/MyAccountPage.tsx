import { useAddress } from '@haqq/shell-shared';
import { AccountPageComponent } from './AccountPage';
import { PendingPage } from './PendingPage';

export default function AccountPage() {
  const { ethAddress, haqqAddress } = useAddress();

  if (!ethAddress || !haqqAddress) {
    return <PendingPage />;
  }

  return (
    <AccountPageComponent ethAddress={ethAddress} haqqAddress={haqqAddress} />
  );
}
