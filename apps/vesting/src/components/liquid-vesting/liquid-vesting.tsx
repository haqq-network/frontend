import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import {
  BroadcastTxResponse,
  getChainParams,
  getFormattedAddress,
  useAddress,
  useLiquidVestingActions,
  useSupportedChains,
  useToast,
  useWallet,
} from '@haqq/shared';
import { AddedToken, LiquidTokensList } from './liquid-tokens-list';
import {
  LiquidToken,
  useLiquidTokens,
} from '../../hooks/use-liquid-tokens/use-liquid-tokens';
import { formatLocaleNumber } from '../../utils/format-number-locale';
import { toFixedAmount } from '../../utils/to-fixed-amount';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Input } from '../Input/Input';
import { ToastError } from '../toasts/toast-error';
import { ToastLoading } from '../toasts/toast-loading';
import { ToastSuccess } from '../toasts/toast-success';
import { Heading } from '../Typography/Typography';

const MIN_AMOUNT = 1000;

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

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 5.5H6C4.89543 5.5 4 6.39543 4 7.5V11.5C4 12.6046 4.89543 13.5 6 13.5H13C13.7571 13.5 14.4159 13.0793 14.7555 12.459C15.0207 11.9745 15.4477 11.5 16 11.5C16.5523 11.5 17.0128 11.9547 16.8766 12.4899C16.4361 14.2202 14.8675 15.5 13 15.5H6C3.79086 15.5 2 13.7091 2 11.5V7.5C2 5.29086 3.79086 3.5 6 3.5H13C14.8675 3.5 16.4361 4.77976 16.8766 6.51012C17.0128 7.04533 16.5523 7.5 16 7.5C15.4477 7.5 15.0207 7.02548 14.7555 6.54103C14.4159 5.92067 13.7571 5.5 13 5.5ZM18 10.5H11C10.2429 10.5 9.58407 10.9207 9.24447 11.541C8.97928 12.0255 8.55228 12.5 8 12.5C7.44772 12.5 6.98717 12.0453 7.12343 11.5101C7.56394 9.77976 9.13252 8.5 11 8.5H18C20.2091 8.5 22 10.2909 22 12.5V16.5C22 18.7091 20.2091 20.5 18 20.5H11C9.13252 20.5 7.56394 19.2202 7.12343 17.4899C6.98717 16.9547 7.44772 16.5 8 16.5C8.55228 16.5 8.97928 16.9745 9.24447 17.459C9.58406 18.0793 10.2429 18.5 11 18.5H18C19.1046 18.5 20 17.6046 20 16.5V12.5C20 11.3954 19.1046 10.5 18 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LiquidVestingHooked({ balance }: { balance: number }) {
  const [liquidationAmount, setLiquidationAmount] = useState<
    number | undefined
  >(undefined);
  const [amountError, setAmountError] = useState<
    undefined | 'min' | 'max' | 'balance'
  >(undefined);
  const [isLiquidationEnabled, setLiquidationEnabled] = useState(true);
  const [isLiquidationPending, setLiquidationPending] = useState(false);
  const { haqqAddress } = useAddress();
  const liquidTokens = useLiquidTokens(haqqAddress);
  const { watchAsset } = useWallet();
  const { liquidate } = useLiquidVestingActions();
  const toast = useToast();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(chain.id);
  const [addedTokens, setAddedTokens] = useState<LiquidToken[]>([]);

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
        loading: <ToastLoading>Liquid token mint in progress</ToastLoading>,
        success: (tx) => {
          console.log('Convert to liquid successful', { tx });
          const token = getLiquidTokenFromResponse(tx);
          const txHash = tx?.txhash;

          setAddedTokens((tokens) => {
            return [...tokens, token];
          });

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>You successfully mint liquid token</div>
                <div>
                  <Link
                    to={`${explorer.cosmos}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[4px] lowercase text-[#0389D4] transition-colors duration-300 hover:text-[#0389D4]/75"
                  >
                    <LinkIcon />
                    <span>{getFormattedAddress(txHash)}</span>
                  </Link>
                </div>
              </div>
            </ToastSuccess>
          );
        },
        error: (error: Error) => {
          return <ToastError>{error.message}</ToastError>;
        },
      });
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setLiquidationEnabled(true);
      setLiquidationPending(false);
    }
  }, [
    balance,
    explorer.cosmos,
    haqqAddress,
    liquidate,
    liquidationAmount,
    toast,
  ]);

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
      addedTokens={addedTokens}
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
  addedTokens,
}: {
  liquidationAmount: number | undefined;
  onAmountChange: (value: number) => void;
  amountError?: 'min' | 'max' | 'balance';
  isLiquidationEnabled: boolean;
  onSubmit: () => void;
  isLiquidationPending: boolean;
  liquidTokens?: LiquidToken[];
  onTokenAddClick: (denom: string) => void;
  addedTokens: LiquidToken[];
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

          <div className="flex flex-col divide-y divide-[#D9D9D9]">
            {addedTokens.map((token) => {
              return (
                <AddedToken
                  key={token.denom}
                  token={token}
                  onTokenAddClick={onTokenAddClick}
                />
              );
            })}
          </div>

          <LiquidTokensList
            liquidTokens={liquidTokens}
            onTokenAddClick={onTokenAddClick}
          />
        </div>
      </div>
    </Card>
  );
}
