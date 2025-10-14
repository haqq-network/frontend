import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function useFaucetAuth() {
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
    isLoading: isAuth0Loading,
  } = useAuth0();

  const handleLogin = useCallback(async () => {
    await loginWithPopup();
  }, [loginWithPopup]);

  return {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    handleLogin,
    isAuth0Loading,
  };
}
