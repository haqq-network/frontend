'use client';
import { ReactElement, useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { Chain, sepolia } from 'viem/chains';
import { useAccount, useChains } from 'wagmi';
import { FAUCET_CHAINS, useWallet } from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import { ChainSelector } from './components/chain-selector';
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
  const { chain = chains[0], address, isConnected } = useAccount();
  const { isHaqqWallet } = useWallet();

  // Filter chains to only include faucet-supported chains
  const faucetChains = useMemo(() => {
    return chains.filter((c) => {
      return FAUCET_CHAINS.includes(c.id) && c.id !== sepolia.id;
    });
  }, [chains]);

  // State for selected target chain (defaults to current chain if supported, otherwise first faucet chain)
  const [selectedChain, setSelectedChain] = useState<Chain>(() => {
    const isSupportedChain = FAUCET_CHAINS.includes(chain.id);
    return isSupportedChain ? chain : faucetChains[0] || chain;
  });
  // Ensure that `selectedChain` is kept in sync with the connected chain.
  // When the user switches wallet network, update selectedChain to match.
  // This keeps the faucet logic and UI in sync with user's wallet.
  // This effect only runs when chain.id changes (i.e., wallet network changes).

  useEffect(() => {
    if (FAUCET_CHAINS.includes(chain.id)) {
      setSelectedChain(chain);
    }
  }, [chain, setSelectedChain]);

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
    claimInfo,
  } = useFaucetClaim({
    serviceEndpoint,
    isAuthenticated,
    getAccessTokenSilently,
    address,
    recaptchaToken,
    chainId: selectedChain.id,
  });

  const { handleNetworkSwitch } = useNetworkSwitch();

  // Handler for chain selection
  const handleChainSelect = useCallback(
    (newChain: Chain) => {
      setSelectedChain(newChain);
      // If connected and the new chain is different, switch to it
      if (isConnected && newChain.id !== chain.id) {
        handleNetworkSwitch(newChain.id);
      }
    },
    [isConnected, chain.id, handleNetworkSwitch],
  );

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
              <ChainSelector
                chains={faucetChains}
                selectedChain={selectedChain}
                onChainSelect={handleChainSelect}
                disabled={claimIsLoading}
              />

              <WalletSection
                chainName={selectedChain.name}
                onNetworkSwitch={() => {
                  return handleNetworkSwitch(selectedChain.id);
                }}
              />

              <GithubSection
                isAuthenticated={isAuthenticated}
                isLoading={isAuth0Loading}
                onLogin={handleLogin}
              />

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
                  claimInfo={claimInfo}
                />
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
