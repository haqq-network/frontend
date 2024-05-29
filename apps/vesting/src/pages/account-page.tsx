import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethToHaqq } from '@haqq/shell-shared';
import { VestingAccountInfo } from '../components/vesting-account-info';

export default function MyAccountPage() {
  const { chain, isConnected, address } = useAccount();
  const addr = address;

  if (!isConnected || !addr) {
    return <Navigate to="/" />;
  }

  if (!chain) {
    return <Navigate to="/switch-chain" />;
  }

  return (
    <VestingAccountInfo address={ethToHaqq(addr)} isLiquidVestingVisible />
  );
}
