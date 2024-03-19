'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { BackButton, Container } from '@haqq/shell-ui-kit';
import { ValidatorInfo } from './components/validator-info';

export function ValidatorDetailsPage() {
  const { address } = useParams<{ address: string }>();

  if (!address) {
    return notFound();
  }

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
