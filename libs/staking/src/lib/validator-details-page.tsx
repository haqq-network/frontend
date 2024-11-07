import { Fragment } from 'react';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { BackButton, Container } from '@haqq/shell-ui-kit/server';
import { ValidatorInfo } from './components/validator-info';

export function ValidatorDetailsPage({ address }: { address: string }) {
  const { t } = useTranslate();
  return (
    <Fragment>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <Link href="/staking">
            <BackButton>{t('staking', 'Staking', { ns: 'common' })}</BackButton>
          </Link>
        </div>
      </Container>

      <ValidatorInfo validatorAddress={address} />
    </Fragment>
  );
}
