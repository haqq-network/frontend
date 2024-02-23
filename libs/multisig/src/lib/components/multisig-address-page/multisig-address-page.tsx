import { useCallback, useEffect, useMemo, useState } from 'react';
import { pubkeyToAddress } from '@haqqjs/amino';
import { StargateClient } from '@haqqjs/stargate';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { formatUnits, isAddress } from 'viem';
import { useNetwork } from 'wagmi';
import {
  ethToHaqq,
  getChainParams,
  getFormattedAddress,
  haqqToEth,
  useBankBalance,
  useClipboard,
  useSupportedChains,
  useTokenPairs,
  useWallet,
} from '@haqq/shared';
import {
  Container,
  CopyIcon,
  Heading,
  LogoutIcon,
  PendingPage,
  WalletIcon,
} from '@haqq/shell-ui-kit';
import { getMultisigAccount } from '../../utils/multisig-helpers';

export function MultisigAddressPage() {
  const { address } = useParams();
  const { isHaqqWallet } = useWallet();
  const [multisigAddress, setMultisigAddress] = useState<
    { eth: string; haqq: string } | undefined
  >(undefined);
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const [multisigAccount, setMultisigAccount] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      if (address.startsWith('0x')) {
        const isValidEthAddress = isAddress(address);

        if (isValidEthAddress) {
          const haqq = ethToHaqq(address);
          setMultisigAddress({
            eth: address,
            haqq,
          });
        }
      } else if (address.startsWith('haqq1')) {
        const eth = haqqToEth(address);
        const isValidEthAddress = isAddress(eth);
        if (isValidEthAddress) {
          setMultisigAddress({
            eth,
            haqq: address,
          });
        }
      }
    }
  }, [address]);

  useEffect(() => {
    (async function fetchMultisig() {
      if (!multisigAddress) {
        return;
      }

      try {
        const client = await StargateClient.connect(chainParams.tmRpcEndpoint);
        const tempHoldings = await client.getAllBalances(multisigAddress.haqq);
        // setHoldings(tempHoldings);
        console.log({ tempHoldings });

        const result = await getMultisigAccount(
          multisigAddress.haqq,
          'haqq',
          client,
        );
        console.log('getMultisigAccount', { result });
        setMultisigAccount(result);
      } catch (error: unknown) {
        // setHasAccountError(true);
        console.error(
          error instanceof Error
            ? error.message
            : 'Multisig address could not be found',
        );
        navigate('/not-found');
      }
    })();
  }, [chain, chainParams.tmRpcEndpoint, multisigAddress, navigate]);

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  if (!multisigAddress || !multisigAccount) {
    return (
      <div>
        <PendingPage />
      </div>
    );
  }

  return (
    <div>
      {!isHaqqWallet && (
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Multisig Manager
            </div>
          </Container>
        </div>
      )}

      <div className="border-y-[1px] border-[#FFFFFF26]">
        <Container>
          <div className="flex flex-col divide-y divide-dashed divide-[#FFFFFF26] pt-[32px]">
            <div className="pb-[32px]">
              <div className="flex flex-row items-center">
                <WalletIcon />
                <Heading level={3} className="mb-[-2px] ml-[8px]">
                  Account:
                </Heading>

                <div className="ml-[16px] leading-[0]">
                  <AccountAddresses address={multisigAddress} />
                </div>

                <div className="ml-[16px] leading-[0]">
                  <div
                    className="text-haqq-orange hover:text-haqq-light-orange font-guise inline-flex cursor-pointer flex-row items-center gap-[4px] text-[12px] font-[600] uppercase leading-[20px]"
                    onClick={() => {
                      navigate('/multisig');
                    }}
                  >
                    <LogoutIcon className="h-[20px] w-[20px]" />
                    Exit
                  </div>
                </div>
              </div>
              <MultisigInfo multisigAccount={multisigAccount} />
            </div>
            <MultisigBalance address={multisigAddress} />
          </div>
        </Container>
      </div>
    </div>
  );
}

function MultisigInfo({ multisigAccount }: { multisigAccount: any }) {
  if (!multisigAccount) {
    return null;
  }

  return (
    <div className="mt-[16px] flex h-[30px] flex-row items-center gap-[32px]">
      <div className="text-[12px] uppercase leading-[16px]">
        <span className="text-white/50">Threshold</span>&nbsp;
        <span className="text-white">
          {multisigAccount.pubkey.value.threshold}
        </span>
        &nbsp;
        <span className="text-white/25">
          from {multisigAccount.pubkey.value.pubkeys.length}
        </span>
      </div>

      <div className="flex flex-row items-center gap-[12px]">
        <div className="text-[12px] uppercase leading-[16px] text-white/50">
          Members
        </div>
        {multisigAccount.pubkey.value.pubkeys.map((pubkey: any) => {
          return <MultisigMember pubkey={pubkey} key={pubkey.value} />;
        })}
      </div>
    </div>
  );
}

function MultisigMember({ pubkey }: { pubkey: string }) {
  const address = pubkeyToAddress(pubkey as any, 'haqq');
  const { copyText } = useClipboard();
  const handleTextCopy = useCallback(() => {
    copyText(address);
  }, [copyText, address]);

  return (
    <div
      className="flex cursor-pointer flex-row items-center gap-[4px] rounded-full bg-white/15 px-[8px] py-[4px] text-[14px] leading-[22px] transition-colors hover:bg-white/25"
      onClick={handleTextCopy}
    >
      <span>{getFormattedAddress(haqqToEth(address))}</span>
      <CopyIcon className="h-[18px] w-[18px] text-white" />
    </div>
  );
}

function formatLocaleNumber(value?: number) {
  if (!value) {
    return undefined;
  }

  return value.toLocaleString(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

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

  return useMemo(() => {
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
}

function MultisigBalance({
  address,
}: {
  address: { eth: string; haqq: string };
}) {
  const liquidTokens = useLiquidTokens(address.haqq);
  const { data: bankBalance } = useBankBalance(address.haqq);
  console.log({ liquidTokens, bankBalance });

  return (
    <div className="py-[32px]">
      <div className="text-[12px] uppercase leading-[16px] text-[#FFFFFF80]">
        Balance
      </div>
      {bankBalance && bankBalance.length < 1 && liquidTokens.length < 1 ? (
        <div className="mt-[6px] flex flex-row gap-[24px]">
          <div className="text-[12px] leading-[16px] text-white/25">
            There is no tokens balance on this multisig wallet
          </div>
        </div>
      ) : (
        <div className="mt-[6px] flex flex-col gap-[4px]">
          {bankBalance?.map((token) => {
            if (token.denom === 'aISLM') {
              return (
                <div
                  className="font-clash text-[24px] leading-[30px] text-white"
                  key={'ISLM'}
                >
                  {formatLocaleNumber(
                    Number.parseFloat(formatUnits(BigInt(token.amount), 18)),
                  )}{' '}
                  ISLM
                </div>
              );
            } else {
              return (
                <div
                  className="font-clash text-[24px] leading-[30px] text-white"
                  key={token.denom}
                >
                  {formatLocaleNumber(
                    Number.parseFloat(formatUnits(BigInt(token.amount), 0)),
                  )}{' '}
                  {getFormattedAddress(token.denom, 8, 4)}
                </div>
              );
            }
          })}

          {liquidTokens.map((token) => {
            return (
              <div
                className="font-clash text-[24px] leading-[30px] text-white"
                key={token.denom}
              >
                {formatLocaleNumber(
                  Number.parseFloat(formatUnits(BigInt(token.amount), 18)),
                )}{' '}
                {token.denom}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AccountAddresses({
  address,
}: {
  address: { eth: string; haqq: string };
}) {
  return (
    <div className="flex flex-row gap-[16px]">
      <div className="flex flex-row items-center gap-[4px]">
        {getFormattedAddress(address.haqq, 6)}
        <CopyButton text={address.haqq} />
      </div>
      <div className="flex flex-row items-center gap-[4px]">
        {getFormattedAddress(address.eth, 6)}
        <CopyButton text={address.eth} />
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { copyText } = useClipboard();
  const handleTextCopy = useCallback(() => {
    copyText(text);
  }, [copyText, text]);

  return (
    <button onClick={handleTextCopy}>
      <CopyIcon className="cursor-pointer text-white/60 transition-colors duration-150 hover:text-white" />
    </button>
  );
}
