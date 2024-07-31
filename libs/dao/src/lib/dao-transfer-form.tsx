'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { formatUnits, Hex, isAddress, parseUnits, erc20Abi } from 'viem';
import { useSendTransaction, useWriteContract } from 'wagmi';
import {
  ethToHaqq,
  haqqToEth,
  useAddress,
  useIndexerBalanceQuery,
  useLiquidTokens,
  useToast,
} from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import {
  Container,
  Heading,
  PlaneIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
} from '@haqq/shell-ui-kit/server';
import { ConfirmModal } from './confirm-modal';

export function DaoTransferForm() {
  const { haqqAddress } = useAddress();
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetAddress, setTargetAddress] = useState('');
  const [isAddressValid, setAddressValid] = useState(false);
  const [validatedAddress, setAValidatedAddress] = useState<string | null>(
    null,
  );
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const liquidTokens = useLiquidTokens(haqqAddress);
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync: sendERC20 } = useWriteContract();
  const toast = useToast();

  useEffect(() => {
    if (targetAddress.startsWith('0x')) {
      const isValidEthAddress = isAddress(targetAddress);
      if (isValidEthAddress) {
        const haqq = ethToHaqq(targetAddress);
        setAddressValid(true);
        setAValidatedAddress(haqq);
      }
    } else if (targetAddress.startsWith('haqq1')) {
      const eth = haqqToEth(targetAddress);
      const isValidAddress = isAddress(eth);
      if (isValidAddress) {
        setAddressValid(true);
        setAValidatedAddress(targetAddress);
      }
    } else {
      setAddressValid(false);
    }
  }, [targetAddress]);

  const liquidTokensToSend = useMemo(() => {
    const tokensSum = liquidTokens.reduce((acc, token) => {
      return acc + BigInt(token.amount);
    }, 0n);

    return formatUnits(tokensSum, 18);
  }, [liquidTokens]);

  const sendNativeToken = useCallback((address: Hex, amount: string) => {
    return sendTransactionAsync({
      to: address,
      value: BigInt(parseUnits(amount, 18)),
    });
  }, []);

  const sendERC20Tokens = useCallback((address: Hex) => {
    return liquidTokens.map((token) => {
      return sendERC20({
        abi: erc20Abi,
        address: token.erc20Address as Hex,
        functionName: 'transfer',
        args: [address, BigInt(token.amount)],
      });
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    setConfirmModalOpen(false);
    if (validatedAddress && balances) {
      const address = validatedAddress.startsWith('haqq1')
        ? haqqToEth(validatedAddress)
        : validatedAddress;

      try {
        const transferPromises = Promise.all([
          ...sendERC20Tokens(address as Hex),
          sendNativeToken(
            address as Hex,
            Math.floor(balances.available).toString(),
          ),
        ]);

        await toast.promise(
          transferPromises,
          {
            loading: <ToastLoading>Transfer in progress</ToastLoading>,
            success: (txs) => {
              console.log('Transfer successful', { txs });

              return (
                <ToastSuccess>
                  <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                    <div>Transfer successful</div>
                  </div>
                </ToastSuccess>
              );
            },
            error: (error) => {
              return <ToastError>{error.message}</ToastError>;
            },
          },
          {
            success: {
              duration: 5000,
            },
          },
        );
      } catch (error) {
        console.error('Error with one of the transactions:', error);
      }
    }
  }, [validatedAddress, balances, sendERC20Tokens, sendNativeToken]);

  return (
    <div className="py-[80px]">
      <Container>
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-row items-center">
            <PlaneIcon />
            <Heading level={3} className="mb-[-2px] ml-[8px]">
              Transfer coins ownership
            </Heading>
          </div>
          <div className="flex flex-col gap-[16px] md:flex-row">
            <div className="flex flex-1 flex-col gap-[8px] md:max-w-lg">
              <div>
                <label
                  htmlFor="targetAddress"
                  className="cursor-pointer text-[13px] font-[500] leading-[22px] text-white"
                >
                  Address
                </label>
              </div>
              <div>
                <input
                  className={clsx(
                    'w-full rounded-[6px] outline-none',
                    'transition-colors duration-100 ease-in',
                    'text-white placeholder:text-[#FFFFFF3D]',
                    'px-[14px] py-[9px] text-[13px] font-[500] leading-[22px]',
                    'bg-[#252528]',
                    'w-full',
                  )}
                  type="text"
                  placeholder="Address in EVM/Bech32 format"
                  required
                  id="targetAddress"
                  name="targetAddress"
                  value={targetAddress}
                  onChange={(event) => {
                    setTargetAddress(event.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div className="md:pt-[32px]">
              <Button
                variant={2}
                disabled={!isAddressValid || !validatedAddress}
                onClick={() => {
                  setConfirmModalOpen(true);
                }}
                className="w-full md:min-w-[120px]"
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {balances !== null &&
          balances !== undefined &&
          validatedAddress !== null && (
            <ConfirmModal
              isOpen={isConfirmModalOpen}
              onConfirm={handleConfirm}
              balance={Math.floor(balances.available).toString()}
              address={validatedAddress}
              tokens={liquidTokensToSend}
              onClose={() => {
                setConfirmModalOpen(false);
              }}
            />
          )}
      </Container>
    </div>
  );
}
