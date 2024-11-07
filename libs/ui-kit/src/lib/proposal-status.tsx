import { ReactElement } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { ProposalStatusEnum } from './proposal-card';

export function ProposalStatus({
  status,
}: {
  status: ProposalStatusEnum;
}): ReactElement {
  const { t } = useTranslate('common');
  const baseClassName =
    'inline-flex rounded-[8px] p-[8px] items-center uppercase text-[14px] font-[500] tracking-[0.01em] font-clash gap-[4px]';

  switch (status) {
    case ProposalStatusEnum.Rejected:
      return (
        <div className={clsx('bg-[#2C1B15] text-[#FF5454]', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
              fill="currentColor"
            />
          </svg>

          <div>{t('rejected', 'Rejected')}</div>
        </div>
      );
    case ProposalStatusEnum.Passed:
      return (
        <div className={clsx('bg-[#152C24] text-[#01B26E]', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
              fill="currentColor"
            />
          </svg>

          <div>{t('passed', 'Passed')}</div>
        </div>
      );
    case ProposalStatusEnum.Voting:
      return (
        <div
          className={clsx(
            'bg-[#01B26E] text-white',
            // yesPercents === maxValue && '',
            // abstainPercents === maxValue && 'bg-[#AAABB2]',
            // noPercents === maxValue && 'bg-[#FF5454]',
            // vetoPercents === maxValue && 'bg-[#E3A13F]',
            baseClassName,
          )}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.31811 13.6819 3.33334 10 3.33334C6.31812 3.33334 3.33335 6.31811 3.33335 10C3.33335 13.6819 6.31812 16.6667 10 16.6667ZM10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333ZM10.8334 10.4289V4.58334H9.16669V9.57116L6.59899 11.4052L7.56772 12.7614L10.8334 10.4289Z"
              fill="currentColor"
            />
          </svg>
          <div>{t('voting', 'Voting')}</div>
        </div>
      );
    case ProposalStatusEnum.Deposit:
      return (
        <div className={clsx('bg-[#0489D4] text-white', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.66663 18.3333C2.11434 18.3333 1.66663 17.8856 1.66663 17.3333V2.66667C1.66663 2.11439 2.11434 1.66667 2.66663 1.66667H17.3333C17.8856 1.66667 18.3333 2.11439 18.3333 2.66667V17.3333C18.3333 17.8856 17.8856 18.3333 17.3333 18.3333H2.66663ZM16.6666 3.33334H3.33329V6.66667H4.16663V8.33334H3.33329V11.6667H4.16663V13.3333H3.33329V16.6667H16.6666V3.33334ZM9.99996 15C7.23854 15 4.99996 12.7614 4.99996 10C4.99996 7.23858 7.23854 5.00001 9.99996 5.00001C12.7614 5.00001 15 7.23858 15 10C15 12.7614 12.7614 15 9.99996 15ZM9.99996 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15906 11.8409 6.66667 9.99996 6.66667C8.15901 6.66667 6.66663 8.15906 6.66663 10C6.66663 11.841 8.15901 13.3333 9.99996 13.3333ZM8.33329 10.8333H11.6666V9.16667H8.33329V10.8333Z"
              fill="currentColor"
            />
          </svg>
          <div>{t('deposit-period', 'Deposit Period')}</div>
        </div>
      );
    case ProposalStatusEnum.Failed:
      return (
        <div className={clsx('bg-white/[8%] text-white', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 11.1785L14.4108 15.5893L15.5893 14.4108L11.1785 10L15.5893 5.58928L14.4108 4.41077L10 8.82151L5.58928 4.41077L4.41077 5.58928L8.82151 10L4.41077 14.4108L5.58928 15.5893L10 11.1785Z"
              fill="currentColor"
            />
          </svg>

          <div>{t('failed', 'Failed')}</div>
        </div>
      );
    default:
      return <div>{status}</div>;
  }
}
