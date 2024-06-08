import { Navigate, useParams } from 'react-router-dom';
import { isAddress } from 'viem';
import { ethToHaqq, haqqToEth } from '@haqq/shell-shared';
import { VestingAccountInfo } from '../components/vesting-account-info';

export default function AccountPage() {
  let validatedAddress: string | undefined;
  const { address } = useParams();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  if (address.startsWith('0x')) {
    const isValidEthAddress = isAddress(address);
    if (isValidEthAddress) {
      const haqq = ethToHaqq(address);
      validatedAddress = haqq;
    }
  } else if (address.startsWith('haqq1')) {
    const eth = haqqToEth(address);
    const isValidAddress = isAddress(eth);
    if (isValidAddress) {
      validatedAddress = address;
    }
  }

  if (!validatedAddress) {
    return <Navigate to="/not-found" replace />;
  }

  return <VestingAccountInfo address={validatedAddress} />;
}
