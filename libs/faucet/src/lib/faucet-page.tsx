'use client';
import { ReactElement, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { useAccount, useChains } from 'wagmi';
import { FAUCET_CHAINS, useWallet } from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import { ClaimTokensSection } from './components/claim-tokens-section';
import { GithubSection } from './components/github-section';
import { WalletSection } from './components/wallet-section';
import { useFaucetAuth } from './hooks/use-faucet-auth';
import { useFaucetClaim } from './hooks/use-faucet-claim';
import { useNetworkSwitch } from './hooks/use-network-switch';
import { useRecaptcha } from './hooks/use-recaptcha';

export function FaucetPage({
  serviceEndpoint,
  reCaptchaSiteKey,
}: {
  serviceEndpoint: string;
  reCaptchaSiteKey: string;
}): ReactElement {
  const { t } = useTranslate();
  const chains = useChains();
  const { chain = chains[0], address } = useAccount();
  const { isHaqqWallet } = useWallet();

  const isTestedge = useMemo(() => {
    return FAUCET_CHAINS.includes(chain.id);
  }, [chain.id]);

  const {
    isAuthenticated,
    getAccessTokenSilently,
    handleLogin,
    isAuth0Loading,
  } = useFaucetAuth();

  const { recaptchaToken, isRecaptchaVerified, handleRecaptchaVerify } =
    useRecaptcha(serviceEndpoint);

  const {
    isTokensClaimed,
    claimIsLoading,
    isRequestTokensAvailable,
    isCountDownVisible,
    handleRequestTokens,
  } = useFaucetClaim({
    serviceEndpoint,
    isAuthenticated,
    getAccessTokenSilently,
    address,
    recaptchaToken,
  });

  const { handleNetworkSwitch } = useNetworkSwitch();

  if (!isTestedge) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-[32px] py-[32px] lg:gap-[68px] lg:py-[68px]">
      {!isHaqqWallet && (
        <div>
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              {t('faucet', 'Faucet', { ns: 'common' })}
            </div>
          </Container>
        </div>
      )}

      <div>
        <Container>
          <div className="mx-auto max-w-lg">
            <div
              className={clsx(
                'flex transform-gpu flex-col gap-y-[32px] rounded-t-[8px] bg-[#ffffff14] p-[24px] lg:p-[32px]',
                !(isAuthenticated && address) && 'rounded-b-[8px]',
              )}
            >
              <WalletSection
                chainName={chain.name}
                onNetworkSwitch={handleNetworkSwitch}
              />

              <GithubSection
                isAuthenticated={isAuthenticated}
                isLoading={isAuth0Loading}
                onLogin={handleLogin}
              />
            </div>

            {isAuthenticated && address && (
              <ClaimTokensSection
                reCaptchaSiteKey={reCaptchaSiteKey}
                isRecaptchaVerified={isRecaptchaVerified}
                isRequestTokensAvailable={isRequestTokensAvailable}
                isTokensClaimed={isTokensClaimed}
                isCountDownVisible={isCountDownVisible}
                claimIsLoading={claimIsLoading}
                onRecaptchaVerify={handleRecaptchaVerify}
                onRequestTokens={handleRequestTokens}
              />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
