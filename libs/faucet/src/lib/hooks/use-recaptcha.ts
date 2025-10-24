import { useCallback, useState } from 'react';

export function useRecaptcha(serviceEndpoint: string) {
  const [recaptchaToken, setRecaptchaToken] = useState<string>();
  const [isRecaptchaVerified, setIsRecaptchaVerified] =
    useState<boolean>(false);

  const handleRecaptchaVerify = useCallback(
    async (value: string) => {
      setRecaptchaToken(value);

      try {
        const requestUrl = new URL('recaptcha/verify', serviceEndpoint);
        const response = await fetch(requestUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recaptcha_key: value }),
        });

        if (response.ok) {
          setIsRecaptchaVerified(true);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [serviceEndpoint],
  );

  return {
    recaptchaToken,
    isRecaptchaVerified,
    handleRecaptchaVerify,
  };
}
