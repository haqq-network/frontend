'use client';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { formatUnits } from 'viem';
import {
  useAddress,
  useBankBalance,
  useDaoAllBalancesQuery,
} from '@haqq/shell-shared';
// import { Button } from '@haqq/shell-ui-kit';
import {
  Container,
  formatNumber,
  Heading,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';
import { FundModal } from './ucdao-fund-modal';

export function DaoPageBalance() {
  const { t } = useTranslate('uc-dao');
  const { haqqAddress } = useAddress();
  const { data: daoBalance } = useDaoAllBalancesQuery(haqqAddress);
  const { data: bankBalance } = useBankBalance(haqqAddress);
  const [isFundModalOpen, setFundModalOpen] = useState(false);

  if ((!daoBalance || daoBalance.length === 0) && !bankBalance) {
    return null;
  }

  return (
    <div className="border-haqq-border border-y-[1px] py-[32px]">
      <Container className="flex flex-col gap-[24px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            {t('my-account', 'My account')}
          </Heading>
        </div>

        {bankBalance && (
          <div className="flex flex-col gap-[6px]">
            <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
              {t('wallet-balance-label', 'Wallet Balance')}
            </div>

            <div className="font-clash flex flex-col gap-[28px] text-[24px] font-[500] leading-[30px] text-white md:flex-row">
              {bankBalance.map((token) => {
                return (
                  <div key={`token-${token.denom}`}>
                    {formatNumber(
                      Number.parseFloat(formatUnits(BigInt(token.amount), 18)),
                    )}{' '}
                    {token.denom.slice(1)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {daoBalance && daoBalance.length > 0 && (
          <div className="flex flex-col gap-[6px]">
            <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
              {t('dao-balance-label', 'DAO Balance')}
            </div>

            <div className="font-clash flex flex-col gap-[28px] text-[24px] font-[500] leading-[30px] text-white md:flex-row">
              {daoBalance.map((token) => {
                return (
                  <div key={`token-${token.denom}`}>
                    {formatNumber(
                      Number.parseFloat(formatUnits(BigInt(token.amount), 18)),
                    )}{' '}
                    {token.denom.slice(1)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* <div>
          <Button
            className="w-full md:max-w-[200px]"
            variant={1}
            onClick={() => {
              setFundModalOpen(true);
            }}
          >
            {t('deposit-to-dao', 'Deposit to DAO')}
          </Button>
        </div> */}
      </Container>

      {isFundModalOpen && (
        <FundModal
          isOpen={isFundModalOpen}
          onClose={() => {
            setFundModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
