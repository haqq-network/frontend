import { useCallback, useEffect, useMemo, useState } from 'react';

interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

interface UseFaucetClaimParams {
  serviceEndpoint: string;
  isAuthenticated: boolean;
  getAccessTokenSilently: () => Promise<string>;
  address?: string;
  recaptchaToken?: string;
}

export function useFaucetClaim({
  serviceEndpoint,
  isAuthenticated,
  getAccessTokenSilently,
  address,
  recaptchaToken,
}: UseFaucetClaimParams) {
  const [claimInfo, setClaimInfo] = useState<ClaimInfo | undefined>(undefined);
  const [isTokensClaimed, setTokensClaimed] = useState<boolean>(false);
  const [claimIsLoading, setClaimIsLoading] = useState<boolean>(false);

  const handleServiceRequest = useCallback(
    async (
      path: string,
      body: Record<string, unknown>,
      method: 'POST' | 'GET' = 'POST',
    ) => {
      const requestUrl = new URL(path, serviceEndpoint);
      const requestOptions = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body }),
      };

      return await fetch(requestUrl, requestOptions);
    },
    [serviceEndpoint],
  );

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

  return {
    claimInfo,
    isTokensClaimed,
    claimIsLoading,
    isRequestTokensAvailable,
    isCountDownVisible,
    handleRequestTokens,
  };
}
