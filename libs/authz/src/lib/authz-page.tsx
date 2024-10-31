'use client';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { useAddress, useWallet } from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import { Container } from '@haqq/shell-ui-kit/server';
import { AuthzGrantsActions } from './authz-grants-actions';
import { GranteeGrantsTable } from './grantee-table';
import { GranterGrantsTable } from './granter-table';

export function AuthzPage() {
  const { ethAddress } = useAddress();
  const { openSelectWallet, isHaqqWallet } = useWallet();
  const { t } = useTranslate('common');

  return (
    <div>
      {!isHaqqWallet && (
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Authz
            </div>
          </Container>
        </div>
      )}

      <div className="flex flex-col gap-[32px]">
        {!ethAddress ? (
          <div
            className={clsx(
              'flex flex-col items-center space-y-[12px] py-[58px]',
              !isHaqqWallet && 'border-haqq-border border-y',
            )}
          >
            <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
              {t('connect-wallet-message', 'You should connect wallet first')}
            </div>
            <Button onClick={openSelectWallet} variant={2}>
              {t('connect-wallet-button', 'Connect wallet')}
            </Button>
          </div>
        ) : (
          <div className="pb-[42px]">
            <AuthzGrantsActions />
            <GranterGrantsTable />
            <GranteeGrantsTable />
          </div>
        )}
      </div>
    </div>
  );
}
