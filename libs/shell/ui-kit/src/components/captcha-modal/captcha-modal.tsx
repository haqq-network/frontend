import { useCallback, useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';
import { MobileHeading, Modal, ModalCloseButton } from '../modal/modal';

export const CaptchaModal = ({
  turnstileSiteKey,
  isClosable,
}: {
  turnstileSiteKey?: string;
  isClosable: boolean;
}) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isCaptchaModalOpen, setCaptchaModalOpen] = useState(false);

  useEffect(() => {
    const tId = setTimeout(() => {
      if (!token && !isClosable) {
        // TODO: remove 'false'
        false && setCaptchaModalOpen(true);
      } else if (token) {
        setCaptchaModalOpen(false);
      }
    }, 500);

    return () => {
      clearTimeout(tId);
    };
  }, [token, isClosable, isCaptchaModalOpen]);

  const handleCaptchaModalClose = useCallback(() => {
    setCaptchaModalOpen(false);
  }, [setCaptchaModalOpen]);

  const handleTokenChange = useCallback(
    (token: string) => {
      setToken(token);
    },
    [setToken],
  );

  return (
    <Modal onClose={handleCaptchaModalClose} isOpen={isCaptchaModalOpen}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[380px] sm:rounded-[12px] sm:p-[36px]">
        <ModalCloseButton
          onClick={handleCaptchaModalClose}
          className="absolute right-[16px] top-[16px]"
        />
        <div className="flex w-full flex-col">
          <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
            <MobileHeading>Complete the captcha</MobileHeading>
          </div>

          <div className="flex flex-col space-y-[12px]">
            <div className="font-guise text-[12px] font-[500] text-black">
              Please complete the captcha to verify that you are not a robot.
            </div>

            {turnstileSiteKey && (
              <Turnstile
                className="w-full"
                sitekey={turnstileSiteKey}
                onVerify={handleTokenChange}
                theme="light"
                fixedSize={true}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
