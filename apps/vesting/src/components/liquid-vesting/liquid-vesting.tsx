import {
  FormEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { formatUnits } from 'viem';
import {
  BroadcastTxResponse,
  useAddress,
  useBankBalance,
  useLiquidVestingActions,
  useToast,
  useTokenPairs,
  useWallet,
} from '@haqq/shared';
import { LiquidToken, LiquidTokensList } from './liquid-tokens-list';
import { formatLocaleNumber } from '../../utils/format-number-locale';
import { toFixedAmount } from '../../utils/to-fixed-amount';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Input } from '../Input/Input';
import { Heading } from '../Typography/Typography';

const MIN_AMOUNT = 1000;

function useLiquidTokens(address: string | undefined) {
  const { data: bankBalance } = useBankBalance(address);
  const { data: tokenPairs } = useTokenPairs();

  const liquidTokenPairs = useMemo(() => {
    return (
      tokenPairs?.filter((pair) => {
        return pair.denom.startsWith('aLIQUID');
      }) ?? []
    );
  }, [tokenPairs]);

  const userLiquidTokens = useMemo(() => {
    return (
      bankBalance?.filter((token) => {
        return token.denom.startsWith('aLIQUID');
      }) ?? []
    );
  }, [bankBalance]);

  // Сопоставление токенов пользователя с их erc20_address
  const liquidTokens = useMemo(() => {
    return userLiquidTokens.map((token) => {
      const pair = liquidTokenPairs.find((pair) => {
        return pair.denom === token.denom;
      });

      const formattedAmount = Number.parseFloat(
        formatUnits(BigInt(token.amount), 18),
      );

      return {
        erc20Address: pair?.erc20_address ?? null,
        denom: token.denom,
        amount: formatLocaleNumber(formattedAmount) as string,
      };
    });
  }, [userLiquidTokens, liquidTokenPairs]);

  return {
    liquidTokens,
  };
}

function getLiquidTokenFromResponse(
  response: BroadcastTxResponse,
): LiquidToken {
  const event = response.events.find((event) => {
    return event.type === 'convert_coin';
  });

  if (!event) {
    throw new Error('No convert_coin event found');
  }

  return {
    denom: event.attributes[3].value,
    amount: event.attributes[2].value,
    erc20Address: event.attributes[4].value,
  };
}

export function LiquidVestingHooked({ balance: _ }: { balance: number }) {
  const balance = 30000;
  const [liquidationAmount, setLiquidationAmount] = useState<
    number | undefined
  >(undefined);
  const [amountError, setAmountError] = useState<
    undefined | 'min' | 'max' | 'balance'
  >(undefined);
  const [isLiquidationEnabled, setLiquidationEnabled] = useState(true);
  const [isLiquidationPending, setLiquidationPending] = useState(false);
  const { haqqAddress } = useAddress();
  const { liquidTokens } = useLiquidTokens(haqqAddress);
  const { watchAsset } = useWallet();

  const { liquidate } = useLiquidVestingActions();
  const toast = useToast();

  useEffect(() => {
    if (balance < MIN_AMOUNT) {
      setLiquidationEnabled(false);
      setAmountError('balance');
    } else if (liquidationAmount && liquidationAmount < MIN_AMOUNT) {
      setLiquidationEnabled(false);
      setAmountError('min');
    } else if (liquidationAmount && liquidationAmount > balance) {
      setLiquidationEnabled(false);
      setAmountError('max');
    } else {
      setLiquidationEnabled(true);
      setAmountError(undefined);
    }
  }, [balance, liquidationAmount]);

  const handleLiquidate = useCallback(async () => {
    try {
      setLiquidationPending(true);
      setLiquidationEnabled(false);

      const liquidatePromise = liquidate(
        haqqAddress,
        liquidationAmount,
        balance,
      );

      await toast.promise(liquidatePromise, {
        // loading: <Toast>Liquid token mint in progress</Toast>,
        loading: (
          <Toast>
            <div>You successfully mint liquid token</div>
            <div>
              <div className="text-[14px] leading-[30px] text-[#0389D4]">
                Add token
              </div>
            </div>
            {/* <div>
              <Button
                onClick={() => {
                  //   if (token.erc20Address) {
                  //     watchAsset(token.denom, token.erc20Address);
                  //   } else {
                  //     console.warn('No erc20 address found');
                  //   }
                }}
              >
                Add token
              </Button>
            </div> */}
          </Toast>
        ),
        success: (tx) => {
          console.log('Convert to liquid successful', { tx });
          const token = getLiquidTokenFromResponse(tx);

          return (
            <Toast>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>You successfully mint liquid token</div>
                <div>
                  <Button
                    onClick={() => {
                      if (token.erc20Address) {
                        watchAsset(token.denom, token.erc20Address);
                      } else {
                        console.warn('No erc20 address found');
                      }
                    }}
                  >
                    Add token
                  </Button>
                </div>
              </div>
            </Toast>
          );
        },
        error: (error: Error) => {
          return <Toast>{error.message}</Toast>;
        },
      });
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setLiquidationEnabled(true);
      setLiquidationPending(false);
    }
  }, [haqqAddress, liquidate, liquidationAmount, toast, watchAsset]);

  const handleWatchAsset = useCallback(
    async (denom: string) => {
      const token = liquidTokens.find((token) => {
        return token.denom === denom;
      });

      if (token && token.erc20Address) {
        // Remove first 'a' from denom
        const assetDenom = token.denom.slice(1);
        watchAsset(assetDenom, token.erc20Address);
      }
    },
    [liquidTokens, watchAsset],
  );

  return (
    <LiquidVesting
      liquidationAmount={liquidationAmount}
      onAmountChange={setLiquidationAmount}
      amountError={amountError}
      isLiquidationEnabled={isLiquidationEnabled && Boolean(liquidationAmount)}
      onSubmit={handleLiquidate}
      isLiquidationPending={isLiquidationPending}
      liquidTokens={liquidTokens}
      onTokenAddClick={handleWatchAsset}
    />
  );
}

export function LiquidVesting({
  liquidationAmount,
  onAmountChange,
  amountError,
  isLiquidationEnabled,
  onSubmit,
  isLiquidationPending,
  liquidTokens,
  onTokenAddClick,
}: {
  liquidationAmount: number | undefined;
  onAmountChange: (value: number) => void;
  amountError?: 'min' | 'max' | 'balance';
  isLiquidationEnabled: boolean;
  onSubmit: () => void;
  isLiquidationPending: boolean;
  liquidTokens?: LiquidToken[];
  onTokenAddClick: (denom: string) => void;
}) {
  const handleInputChange = useCallback(
    (value: string | undefined) => {
      if (value) {
        const parsedValue = value.replace(/ /g, '').replace(/,/g, '');
        const normalizedAmount = toFixedAmount(
          Number.parseFloat(parsedValue),
          3,
        );

        if (normalizedAmount) {
          onAmountChange(normalizedAmount);
        }
      }
    },
    [onAmountChange],
  );

  const hintAndState = useMemo(() => {
    if (amountError === 'balance') {
      return {
        hint: `You don't have enough assets. Minimum amount is ${formatLocaleNumber(MIN_AMOUNT)} ISLM`,
        state: 'error' as const,
      };
    } else if (amountError === 'min') {
      return {
        hint: `Minimum amount is ${formatLocaleNumber(MIN_AMOUNT)} ISLM`,
        state: 'error' as const,
      };
    } else if (amountError === 'max') {
      return {
        hint: 'You cannot convert more then you have',
        state: 'error' as const,
      };
    } else {
      return {
        state: 'normal' as const,
      };
    }
  }, [amountError]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden">
      <div className="px-[16px] pt-[24px]">
        <Heading level={4}>
          <span>Liquid vesting</span>{' '}
          <div className="bg-primary pointer-events-none ml-[8xp] inline-block translate-y-[-8px] select-none rounded-[6px] px-[6px] py-[2px] font-sans text-[11px] font-[600] uppercase leading-[16px] text-white">
            New
          </div>
        </Heading>
      </div>

      <div className="p-[16px]">
        <div className="flex flex-col gap-[16px]">
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-row gap-[12px]">
              <div className="flex-1">
                <Input
                  required
                  label="Amount"
                  placeholder={`Min ${formatLocaleNumber(MIN_AMOUNT)} ISLM`}
                  value={liquidationAmount}
                  onChange={handleInputChange}
                  {...hintAndState}
                />
              </div>
              <div className="flex-initial pt-[25px]">
                <Button
                  className="!px-8"
                  disabled={!isLiquidationEnabled}
                  isPending={isLiquidationPending}
                  type="submit"
                >
                  Convert to liquid
                </Button>
              </div>
            </div>
          </form>

          <LiquidTokensList
            liquidTokens={liquidTokens}
            onTokenAddClick={onTokenAddClick}
          />
        </div>
      </div>
    </Card>
  );
}

function Toast({ children }: PropsWithChildren) {
  return (
    <div className="max-w-lg gap-[8px] rounded-[8px] bg-white p-[16px] font-sans text-[16px] leading-[24px] text-black shadow-lg">
      {children}
    </div>
  );
}
