// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './Components';
import Reaptcha from 'reaptcha';
import Countdown from 'react-countdown';
import SuccessIndicator from 'react-success-indicator';
import { useAuth0 } from '@auth0/auth0-react';
import { AccountInfo } from './AccountInfo';
import { useTheme } from './ThemeContainer';
import { PulseLoader } from 'react-spinners';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { getChainParams } from '../config';
import { hexValue } from 'ethers/lib/utils';
import { environment } from '../environments/environment';

interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

const { serviceConfig, recaptchaConfig } = environment;

export function Faucet(): ReactElement {
  const chain = getChainParams(environment.chain);
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
  const { isDark } = useTheme();
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
                  rpcUrls: [chain.rpcUrls.default],
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
  }, []);

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
    <div className="container px-2 sm:px-6 lg:px-8 mx-auto">
      <div className="mx-auto max-w-md rounded-xl shadow-lg my-20 backdrop-filter backdrop-blur transform-gpu bg-white/50 dark:bg-slate-700/40">
        <div className="flex flex-col space-y-5 py-6">
          <div className="px-5">
            <div className="flex flex-row space-x-4  mb-4">
              <h2 className="flex-1 text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 inline-flex">
                Connect wallet
              </h2>

              {currentChain?.unsupported && (
                <div className="flex items-center">
                  <a
                    className="text-sm text-[#5baacd] hover:text-[#5baacd]/80 cursor-pointer leading-snug"
                    onClick={handleNetworkSwitch}
                  >
                    Switch to {chain.name}
                  </a>
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
                      block
                      key={connector.id}
                      onClick={() => {
                        connect({ connector });
                      }}
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

          <div className="px-5">
            <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-4">
              Github Auth
            </h2>

            {isAuthenticated ? (
              <div className="flex flex-row space-x-4">
                {user && (
                  <div className="flex flex-row space-x-4 items-center flex-1">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.nickname}
                        className="rounded-full h-10 w-10"
                      />
                    )}
                    <p>{user.nickname}</p>
                  </div>
                )}
              </div>
            ) : (
              <Button block onClick={handleLogin} disabled={isAuth0Loading}>
                Login with github
              </Button>
            )}
          </div>

          {isAuthenticated && address && (
            <div className="px-5">
              <h2 className="text-md font-semibold uppercase text-[#0c0c0c] dark:text-gray-100 mb-5">
                {isCountDownVisible
                  ? 'Next request tokens available after'
                  : 'Claim tokens'}
              </h2>

              {claimIsLoading && (
                <div className="flex flex-row space-x-4 items-center my-2">
                  <PulseLoader
                    color="#5baacd"
                    speedMultiplier={0.7}
                    size={16}
                  />
                </div>
              )}

              {isRequestTokensAvailable && (
                <div>
                  {isRecaptchaVerified ? (
                    <div>
                      <Button block onClick={handleRequestTokens}>
                        Request tokens
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-row space-x-4 items-center">
                      <Reaptcha
                        sitekey={recaptchaConfig.siteKey}
                        onVerify={handleRecapthcaVerify}
                        theme={isDark ? 'dark' : 'light'}
                      />
                    </div>
                  )}
                </div>
              )}

              {isTokensClaimed && (
                <div className="flex flex-row space-x-4 items-center">
                  <SuccessIndicator size="36px" color="green" />
                  <p>Tokens claimed!</p>
                </div>
              )}

              {isCountDownVisible && (
                <div className="flex flex-row space-x-4 items-center">
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
    </div>
  );
}

export { Faucet as default };
