'use client';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { useAddress, useWallet } from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import { Container } from '@haqq/shell-ui-kit/server';
import { DaoPageBalance } from './ucdao-page-balance';
import { DaoTransferForm } from './ucdao-transfer-form';

export function UCDaoPage() {
  const { t } = useTranslate();
  const { ethAddress } = useAddress();
  const { openSelectWallet, isHaqqWallet } = useWallet();

  return (
    <div>
      {!isHaqqWallet && (
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              {t('dao-page-title', 'UnitedContributors DAO', { ns: 'uc-dao' })}
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
              {t('should-connect-wallet', 'You should connect wallet first', {
                ns: 'common',
              })}
            </div>
            <Button onClick={openSelectWallet} variant={2}>
              {t('connect-wallet-button', 'Connect wallet', { ns: 'common' })}
            </Button>
          </div>
        ) : (
          <div className="pb-[42px]">
            <DaoPageBalance />
            <DaoTransferForm />
          </div>
        )}
      </div>
    </div>
  );
}
