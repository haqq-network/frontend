'use client';
import { useMemo, useState } from 'react';
import { Coin } from '@evmos/provider';
import { useTranslate } from '@tolgee/react';
import { formatUnits, Hex } from 'viem';
import { useReadContract } from 'wagmi';
import {
  formatEthDecimal,
  getFormattedAddress,
  useAddress,
  useBankBalance,
  useDaoAllBalancesQuery,
  useTokenPairs,
} from '@haqq/shell-shared';
// import { Button } from '@haqq/shell-ui-kit';
import { Container, Heading, WalletIcon } from '@haqq/shell-ui-kit/server';
import { FundModal } from './ucdao-fund-modal';

const useFilterZeroBalances = (balances?: Coin[] | null) => {
  return useMemo(() => {
    return balances?.filter((balance) => {
      return balance.amount !== '0';
    });
  }, [balances]);
};

export function DaoPageBalance() {
  const { t } = useTranslate();
  const { haqqAddress } = useAddress();
  const { data: daoBalances } = useDaoAllBalancesQuery(haqqAddress);
  const { data: bankBalances } = useBankBalance(haqqAddress);
  const [isFundModalOpen, setFundModalOpen] = useState(false);

  const filteredDaoBalances = useFilterZeroBalances(daoBalances);
  const filteredBankBalances = useFilterZeroBalances(bankBalances);

  if (
    (!filteredDaoBalances || filteredDaoBalances.length === 0) &&
    (!filteredBankBalances || filteredBankBalances.length === 0)
  ) {
    return null;
  }

  return (
    <div className="border-haqq-border border-y-[1px] py-[32px]">
      <Container className="flex flex-col gap-[24px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            My account
          </Heading>
        </div>

        {filteredBankBalances && filteredBankBalances.length > 0 && (
          <BalancesDisplay
            label={t('wallet-balance-label', 'Wallet Balance', {
              ns: 'uc-dao',
            })}
            balances={filteredBankBalances}
          />
        )}

        {filteredDaoBalances && filteredDaoBalances.length > 0 && (
          <BalancesDisplay
            label={t('dao-balance-label', 'DAO Balance', {
              ns: 'uc-dao',
            })}
            balances={filteredDaoBalances}
          />
        )}

        {/* <div>
          <Button
            className="w-full md:max-w-[200px]"
            variant={1}
            onClick={() => {
              setFundModalOpen(true);
            }}
          >
            Deposit to DAO
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

const MAX_VALUE = BigInt(10 ** 9);

function BalancesDisplay({
  label,
  balances,
}: {
  label: string;
  balances: Coin[];
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
        {label}
      </div>

      <div className="font-clash flex flex-col flex-wrap gap-[28px] text-[24px] font-[500] leading-[30px] text-white md:flex-row">
        {balances.map((token) => {
          const precision = BigInt(token.amount) > MAX_VALUE ? 2 : 16;
          return (
            <div key={`token-${token.denom}`}>
              {formatEthDecimal(BigInt(token.amount), precision)}{' '}
              <TokenName denom={token.denom} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenName({ denom }: { denom: string }) {
  const tokenName = useDenomToTokenName(denom);
  return <>{tokenName}</>;
}

const minDenomIdentifierLength = 48;
const allItemsLimit = 1000;

function useDenomToTokenName(denom: string) {
  const { data: tokenPairs } = useTokenPairs(allItemsLimit);

  const contractAddress = tokenPairs?.find((pair) => {
    return pair.denom === denom;
  })?.erc20_address as Hex;

  const tokenNameFromContract = useGetNameFromContract(contractAddress);

  if (tokenNameFromContract === undefined) {
    return denom.length >= minDenomIdentifierLength
      ? getFormattedAddress(denom, 6, 6, '...')
      : denom.slice(1);
  } else {
    return tokenNameFromContract;
  }
}

function useGetNameFromContract(contractAddress?: Hex) {
  const { data: contractData } = useReadContract({
    address: contractAddress,
    args: [],
    functionName: 'name',
    abi: [
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    query: { enabled: !!contractAddress },
  });

  return contractData;
}
