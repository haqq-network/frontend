// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import Reaptcha from 'reaptcha';
import Countdown from 'react-countdown';
import SuccessIndicator from 'react-success-indicator';
import { useAuth0 } from '@auth0/auth0-react';
import { AccountInfo } from './AccountInfo';
import { PulseLoader } from 'react-spinners';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { hexValue } from 'ethers/lib/utils';
import { environment } from '../environments/environment';
import { getChainParams, useConfig } from '@haqq/shared';
import { Button, CardText } from '@haqq/shell/ui-kit';
import clsx from 'clsx';

interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

const { serviceConfig, reCaptchaConfig } = environment;

function CardHeading({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={clsx(
        'font-serif text-[20px] font-[500] uppercase leading-[26px] text-white',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function Faucet(): ReactElement {
  const { chainName } = useConfig();
  const chain = getChainParams(chainName);
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
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>();
  const [claimIsLoading, setClaimIsLoading] = useState<boolean>(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { chain: currentChain } = useNetwork();

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
    const { ethereum } = window;

    if (ethereum) {
      const targetNetworkIdHex = hexValue(chain.id);

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetNetworkIdHex }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: targetNetworkIdHex,
                  chainName: chain.name,
                  rpcUrls: [chain.ethRpcEndpoint],
                  nativeCurrency: chain.nativeCurrency,
                },
              ],
            });
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error(error);
        }
      }
    }
  }, [chain.ethRpcEndpoint, chain.id, chain.name, chain.nativeCurrency]);

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
    <div className="container mx-auto px-2 sm:px-6 lg:px-8">
      <div className="mx-auto my-20 max-w-lg transform-gpu overflow-hidden rounded-[8px] bg-[#ffffff14]">
        <div className="flex flex-col space-y-5 px-5 py-6">
          <div className="flex flex-row justify-between">
            <CardHeading>Connect wallet</CardHeading>

            {currentChain?.unsupported && (
              <div className="flex items-center">
                <span
                  className="text-haqq-orange hover:text-haqq-light-orange cursor-pointer text-sm leading-snug transition-colors duration-300"
                  onClick={handleNetworkSwitch}
                >
                  Switch to {chain.name}
                </span>
              </div>
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
                      '(connecting)'}
                  </Button>
                );
              })}

              {error && <div>{error.message}</div>}
            </div>
          )}

          {isConnected && <AccountInfo />}

          <CardHeading>Github Auth</CardHeading>

          {isAuthenticated ? (
            <div className="mt-[16px] flex flex-row gap-[16px]">
              {user && (
                <div className="flex flex-1 flex-row items-center space-x-4">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.nickname}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <p>{user.nickname}</p>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="mt-[16px] w-full"
              onClick={handleLogin}
              disabled={isAuth0Loading}
              variant={2}
            >
              Login with github
            </Button>
          )}
        </div>

        {isAuthenticated && address && (
          <div className="flex flex-col gap-[16px] bg-white bg-opacity-[15%] px-[20px] py-[24px]">
            <CardHeading>
              {isCountDownVisible
                ? 'Next request tokens available after'
                : 'Claim tokens'}
            </CardHeading>

            {claimIsLoading && (
              <div className="my-2 flex flex-row items-center space-x-4">
                <PulseLoader color="#FF8D69" speedMultiplier={0.7} size={16} />
              </div>
            )}

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
                  <div className="flex flex-row items-center space-x-4">
                    <Reaptcha
                      sitekey={reCaptchaConfig.siteKey}
                      onVerify={handleRecapthcaVerify}
                      theme={'dark'}
                    />
                  </div>
                )}
              </div>
            )}

            {isTokensClaimed && (
              <div className="flex flex-row items-center space-x-4">
                <SuccessIndicator size="36px" color="green" />
                <CardText>Tokens claimed!</CardText>
              </div>
            )}

            {isCountDownVisible && (
              <div className="flex flex-row items-center space-x-4">
                <Countdown
                  date={Date.now() + claimInfo.next_claim_sec * 1000}
                  onComplete={requestClaimInfo}
                  renderer={({ hours, minutes, seconds }) => {
                    // Render a countdown
                    return (
                      <div className="text-4xl font-semibold leading-tight">
                        {hours < 10 ? '0' + hours : hours}:
                        {minutes < 10 ? '0' + minutes : minutes}:
                        {seconds < 10 ? '0' + seconds : seconds}
                      </div>
                    );
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { Faucet as default };
