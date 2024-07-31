import { formatUnits } from 'viem';
import {
  useAddress,
  useIndexerBalanceQuery,
  useLiquidTokens,
} from '@haqq/shell-shared';
import {
  Container,
  formatNumber,
  Heading,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';

export function DaoBalance() {
  const { haqqAddress } = useAddress();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const liquidTokens = useLiquidTokens(haqqAddress);

  return (
    <div className="border-haqq-border border-y-[1px] py-[32px]">
      <Container className="flex flex-col gap-[24px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            My account
          </Heading>
        </div>

        <div className="flex flex-col gap-[6px]">
          <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
            Balance
          </div>

          <div className="font-clash flex flex-row gap-[28px] text-[24px] font-[500] leading-[30px] text-white">
            {balances && <div>{formatNumber(balances.available)} ISLM</div>}

            {liquidTokens.map((token) => {
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
      </Container>
    </div>
  );
}
