import { useMemo } from 'react';
import { T, useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { CardSubText, CardText } from './card';
import { formatNumber } from '../server';

export function ProposalDepositProgress({
  userDeposit,
  totalDeposit,
  minDeposit,
  symbol,
}: {
  userDeposit?: number;
  totalDeposit: number;
  minDeposit: number;
  symbol: string;
}) {
  const { t } = useTranslate('common');
  const percent = useMemo(() => {
    return Math.min((totalDeposit / minDeposit) * 100, 100);
  }, [minDeposit, totalDeposit]);

  return (
    <div className="flex w-full flex-col space-y-[8px]">
      <div className="flex items-center space-x-[12px]">
        <CardText className="text-[13px] leading-[20px] lg:text-[16px] lg:leading-[26px]">
          {t('total-deposit', 'Total deposit')}
        </CardText>
        {userDeposit !== undefined && userDeposit > 0 && (
          <div className="inline-flex space-x-[6px]">
            <CardSubText className="text-white/50">
              <T
                keyName="you-deposited"
                defaultValue="You Deposited: <span>{amount}</span>"
                params={{
                  amount: formatNumber(userDeposit),
                  span: <span className="text-white" />,
                }}
              />
            </CardSubText>
          </div>
        )}
      </div>

      <div className="relative h-[8px] w-full overflow-hidden rounded-[4px] bg-[#FFFFFF26]">
        <div
          className={clsx(
            'absolute left-0 top-0 h-[8px] transform-gpu rounded-[4px] bg-[#0489D4]',
            'duration-250 transition-[width] ease-out',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="font-guise text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
        {t(
          'deposit-total-from-min',
          '{totalDeposit} {symbol} from {minDeposit} {symbol}',
          {
            totalDeposit: formatNumber(totalDeposit),
            minDeposit: formatNumber(minDeposit),
            symbol: symbol.toLocaleUpperCase(),
          },
        )}
      </div>
    </div>
  );
}
