'use client';
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { haqqTestedge2 } from '@wagmi/chains';
import clsx from 'clsx';
import { notFound } from 'next/navigation';
import SuccessIndicator from 'react-success-indicator';
import Reaptcha from 'reaptcha';
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useSupportedChains, useWallet } from '@haqq/shell-shared';
import {
  Button,
  Heading,
  OrangeLink,
  ProposalPeriodTimer,
  SpinnerLoader,
  WalletIcon,
  EarnIcon,
  Container,
} from '@haqq/shell-ui-kit';
import { AccountInfo } from './components/account-info';

interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

export function FaucetPage(): ReactElement {
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
    isLoading: isAuth0Loading,
  } = useAuth0();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();
  const [isRecaptchaVerified, setIsRecaptchaVerified] =
    useState<boolean>(false);
  const [isTokensClaimed, setTokensClaimed] = useState<boolean>(false);
  const [claimInfo, setClaimInfo] = useState<ClaimInfo | undefined>(undefined);
  const [claimIsLoading, setClaimIsLoading] = useState<boolean>(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { isNetworkSupported } = useWallet();
  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  if (!isTestedge) {
    notFound();
  }

  const handleServiceRequest = useCallback(
    async (
      path: string,
      body: Record<string, unknown>,
      method: 'POST' | 'GET' = 'POST',
    ) => {
      const requestUrl = `${serviceConfig.endpoint}/${path}`;
      const requestOptions = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body }),
      };

      return await fetch(requestUrl, requestOptions);
    },
    [],
  );

  const handleLogin = useCallback(async () => {
    await loginWithPopup();
  }, [loginWithPopup]);

  const requestClaimInfo = useCallback(async () => {
    setClaimIsLoading(true);
    const token = await getAccessTokenSilently();

    try {
      const response = await handleServiceRequest(`chain/claim_info`, {
        token,
      });

      const responseData = await response.json();
      setClaimInfo(responseData as ClaimInfo);
      setClaimIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [getAccessTokenSilently, handleServiceRequest]);

  const handleRecapthcaVerify = useCallback(
    async (value: string) => {
      setRecaptchaToken(value);

      try {
        const response = await handleServiceRequest('recaptcha/verify', {
          recaptcha_key: value,
        });

        if (response.ok) {
          setIsRecaptchaVerified(true);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [handleServiceRequest],
  );

  const handleRequestTokens = useCallback(async () => {
    setClaimIsLoading(true);
    const token = await getAccessTokenSilently();

    try {
      const response = await handleServiceRequest('chain/claim', {
        wallet: address,
        recaptcha_token: recaptchaToken,
        token,
      });

      if (response.ok) {
        setClaimIsLoading(false);
        setTokensClaimed(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [address, getAccessTokenSilently, handleServiceRequest, recaptchaToken]);

  const handleNetworkSwitch = useCallback(async () => {
    if (switchNetworkAsync) {
      try {
        await switchNetworkAsync(chains[0].id);
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }, [chains, switchNetworkAsync]);

  useEffect(() => {
    if (isAuthenticated) {
      requestClaimInfo();
    }
  }, [requestClaimInfo, isAuthenticated]);

  const isRequestTokensAvailable = useMemo(() => {
    return Boolean(
      isAuthenticated &&
        address &&
        claimInfo?.available &&
        isTokensClaimed === false &&
        claimIsLoading === false,
    );
  }, [address, claimInfo, claimIsLoading, isAuthenticated, isTokensClaimed]);

  const isCountDownVisible = useMemo(() => {
    return Boolean(
      isAuthenticated && !claimInfo?.available && claimInfo?.next_claim_sec,
    );
  }, [claimInfo, isAuthenticated]);

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Faucet
          </div>
        </Container>
      </div>

      <div className="pb-[32px] lg:pb-[68px]">
        <Container>
          <div className="mx-auto max-w-lg">
            <div
              className={clsx(
                'flex transform-gpu flex-col gap-y-[32px] rounded-t-[8px] bg-[#ffffff14] p-[24px] lg:p-[32px]',
                !(isAuthenticated && address) && 'rounded-b-[8px]',
              )}
            >
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <WalletIcon />
                    <Heading level={3} className="mb-[-2px] ml-[8px]">
                      Wallet
                    </Heading>
                  </div>

                  {!isNetworkSupported && (
                    <OrangeLink
                      className="font-clash mb-[-2px] text-end !text-[12px] uppercase"
                      onClick={handleNetworkSwitch}
                    >
                      Switch to {chain.name}
                    </OrangeLink>
                  )}
                </div>

                {!isConnected && (
                  <div className="flex flex-col space-y-2">
                    {connectors.map((connector) => {
                      if (!connector.ready) {
                        return null;
                      }

                      return (
                        <Button
                          key={connector.id}
                          onClick={() => {
                            connect({ connector });
                          }}
                          variant={2}
                        >
                          {connector.name}
                          {isLoading &&
                            connector.id === pendingConnector?.id &&
                            ' (connecting)'}
                        </Button>
                      );
                    })}

                    {error && <div>{error.message}</div>}
                  </div>
                )}

                {isConnected && <AccountInfo />}
              </div>

              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-row items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[26px] w-[26px]"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 0.950001C5.89746 0.950001 0.950012 5.89744 0.950012 12C0.950012 18.1025 5.89746 23.05 12 23.05C18.1026 23.05 23.05 18.1025 23.05 12C23.05 5.89744 18.1026 0.950001 12 0.950001ZM8.4516 3.59213C9.49767 3.13768 10.7185 2.87244 12.0038 2.87244C17.037 2.87244 21.1182 6.94986 21.1256 11.9813L21.1247 11.9824V12.0038C21.1247 16.0831 18.4481 19.5373 14.7544 20.7047V17.5221C14.7544 16.8615 14.6199 16.3061 14.329 15.8805C14.661 15.8312 14.9756 15.7664 15.2834 15.6861L15.3308 15.6737L15.3295 15.6685C15.7661 15.5381 16.1537 15.3689 16.5151 15.1597C16.9367 14.9231 17.2959 14.6237 17.5929 14.2695L17.5978 14.2636L17.5986 14.2625C17.9025 13.893 18.142 13.4125 18.3239 12.8312C18.5082 12.242 18.5981 11.5718 18.5981 10.8241C18.5981 9.78156 18.2722 8.8772 17.6191 8.12338C17.9046 7.31028 17.8431 6.4185 17.4627 5.46318L17.4205 5.3573L17.3121 5.32231C16.9897 5.21829 16.5759 5.29173 16.1115 5.46719C15.6413 5.64147 15.2384 5.8383 14.8571 6.07025L14.8151 6.0958L14.8164 6.09798L14.4864 6.30608C13.7494 6.1055 12.9152 5.99174 12.0557 5.99174C11.2428 5.99174 10.4543 6.0935 9.70074 6.28482C9.36628 5.77506 8.85126 5.50141 8.34304 5.36899C7.78288 5.22303 7.2065 5.24103 6.81625 5.31482L6.71232 5.33447L6.65612 5.42407C6.38508 5.8561 6.2735 6.39744 6.26917 6.90563C6.26541 7.34609 6.342 7.78406 6.48488 8.13205C5.83677 8.88413 5.51333 9.78557 5.51333 10.8241C5.51333 11.5718 5.60327 12.2399 5.78777 12.825C5.96947 13.4013 6.20684 13.8808 6.50531 14.2537L6.50641 14.255C6.80987 14.6272 7.17644 14.936 7.59425 15.1666L7.61692 15.1773C7.97948 15.3871 8.3966 15.5653 8.83506 15.6889L8.87787 15.699C9.14932 15.7721 9.4565 15.8344 9.77688 15.8817C9.59314 16.1558 9.47114 16.4818 9.40606 16.8533C9.2867 16.9022 9.15468 16.9434 9.01689 16.9731L9.00493 16.9751L8.99911 16.9763C8.81059 17.0142 8.58992 17.0359 8.36336 17.0359H8.31477C8.08726 17.0359 7.85215 16.9625 7.60591 16.7995C7.36539 16.6402 7.15195 16.4037 6.96967 16.0788L6.96692 16.0741C6.7901 15.7748 6.55796 15.526 6.2803 15.3349L6.27608 15.3318L6.27089 15.3283C6.00943 15.1509 5.76603 15.0271 5.54856 14.9832L5.43796 14.9585C5.39944 14.9492 5.35788 14.9445 5.31739 14.9445C5.1086 14.9445 4.92686 15.0635 4.83766 15.2367L4.83621 15.2396L4.82245 15.2663C4.78161 15.3432 4.76206 15.4294 4.76206 15.5152C4.76206 15.7309 4.88836 15.9172 5.07135 16.0036L5.07767 16.0064C5.21708 16.07 5.37442 16.2003 5.54513 16.4226L5.54842 16.4267C5.68898 16.6018 5.814 16.8002 5.91424 17.0128L5.91492 17.0142L5.92083 17.0274L5.92169 17.0294L6.04531 17.3135C6.17002 17.6778 6.39459 17.9845 6.68702 18.2069L6.68807 18.2077L6.68989 18.209C6.95977 18.4201 7.28592 18.5716 7.64187 18.6383L7.64348 18.6385L7.65744 18.6407C7.93635 18.6949 8.25791 18.7286 8.58409 18.7345H8.58917C8.62472 18.7355 8.66827 18.7364 8.7125 18.7364C8.93304 18.7364 9.1493 18.7175 9.35953 18.6835C9.36044 18.9411 9.36251 19.2277 9.36574 19.5431C9.36806 19.7564 9.36976 20.2679 9.37084 20.7381C5.58474 19.5728 2.87918 16.1013 2.87918 12C2.87918 8.24564 5.14505 5.01985 8.38571 3.61751L8.44126 3.59662L8.4516 3.59213Z"
                      fill="currentColor"
                    />
                  </svg>

                  <Heading level={3} className="mb-[-2px] ml-[8px]">
                    Github
                  </Heading>
                </div>

                {isAuthenticated ? (
                  <div className="flex flex-row gap-[16px]">
                    {user && (
                      <div className="flex flex-1 flex-row items-center space-x-4">
                        {user.picture && (
                          <img
                            src={user.picture}
                            alt={user.nickname}
                            className="h-[40px] w-[40px] rounded-full"
                          />
                        )}
                        <p className="text-[13px] font-[500] leading-[22px] text-white lg:text-[18px] lg:leading-[28px]">
                          {user.nickname}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleLogin}
                    disabled={isAuth0Loading}
                    variant={2}
                  >
                    Login with github
                  </Button>
                )}
              </div>
            </div>

            {isAuthenticated && address && (
              <div className="flex flex-col gap-[16px] rounded-b-[8px] bg-[#FFFFFF26] p-[24px] lg:p-[32px]">
                <div className="flex flex-row items-center">
                  <EarnIcon className="h-[26px] w-[26px]" />
                  <Heading level={3} className="mb-[-2px] ml-[8px]">
                    Claim tokens
                  </Heading>
                </div>

                {claimIsLoading ? (
                  <div className="flex h-[44px] flex-row items-center justify-center">
                    <SpinnerLoader className="mx-auto" />
                  </div>
                ) : (
                  <Fragment>
                    {isRequestTokensAvailable && (
                      <div>
                        {isRecaptchaVerified ? (
                          <div>
                            <Button
                              variant={2}
                              className="w-full"
                              onClick={handleRequestTokens}
                            >
                              Request tokens
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-row items-center">
                            <Reaptcha
                              sitekey={reCaptchaConfig.siteKey}
                              onVerify={handleRecapthcaVerify}
                              theme="dark"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {isTokensClaimed && (
                      <div className="flex flex-row items-center gap-[12px]">
                        <SuccessIndicator size="44px" color="#01B26E" />
                        <p className="text-[13px] font-[500] leading-[22px] text-white lg:text-[18px] lg:leading-[28px]">
                          Tokens claimed!
                        </p>
                      </div>
                    )}

                    {isCountDownVisible && claimInfo && (
                      <ProposalPeriodTimer
                        color="blue"
                        date={
                          new Date(Date.now() + claimInfo.next_claim_sec * 1000)
                        }
                        title="Next request tokens available after"
                      />
                    )}
                  </Fragment>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
