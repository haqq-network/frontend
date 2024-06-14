import { Fragment } from 'react';
import Link from 'next/link';
import { BackButton, Container } from '@haqq/shell-ui-kit/server';
import { ValidatorInfo } from './components/validator-info';

export function ValidatorDetailsPage({ address }: { address: string }) {
  return (
    <Fragment>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <Link href="/staking">
            <BackButton>Staking</BackButton>
          </Link>
        </div>
      </Container>

      <ValidatorInfo validatorAddress={address} />
    </Fragment>
  );
}
