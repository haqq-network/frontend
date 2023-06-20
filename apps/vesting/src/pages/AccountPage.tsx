import { Container } from '../components/Layout/Layout';
import { environment } from '../environments/environment';
import { Navigate, useParams } from 'react-router-dom';
import { AccountDepositStatsWidget } from '../components/AccountDepositStatsWidget/AccountDepositStatsWidget';
import { Fragment } from 'react';
// import { DepositWithdrawalList } from '../components/DepositWithdrawalList/DepositWithdrawalList';

export function AccountPage() {
  const { address } = useParams();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Container className="flex flex-col space-y-12 py-8 sm:py-20">
      {environment.contractAddress && (
        <Fragment>
          <AccountDepositStatsWidget
            contractAddress={environment.contractAddress as `0x${string}`}
            address={address as `0x${string}`}
          />
          {/* <DepositWithdrawalList
            contractAddress={environment.contractAddress}
            address={address}
          /> */}
        </Fragment>
      )}
    </Container>
  );
}

export { AccountPage as default };
