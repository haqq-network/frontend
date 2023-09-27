import { useCallback } from 'react';
import Turnstile from 'react-turnstile';
import { Heading } from '../heading/heading';
import { Modal, ModalCloseButton } from '../modal/modal';

export const CaptchaModal = ({
  turnstileSiteKey,
  isOpened,
  setCaptchaModalOpen,
  setToken,
}: {
  turnstileSiteKey?: string;
  isOpened: boolean;
  setCaptchaModalOpen: (v: boolean) => void;
  setToken: (v: string) => void;
}) => {
  const handleCaptchaModalClose = useCallback(() => {
    setCaptchaModalOpen(false);
  }, [setCaptchaModalOpen]);

  return (
    <Modal onClose={handleCaptchaModalClose} isOpen={isOpened}>
      <div className="rounded-[12px] bg-white pb-[36px] pl-[16px] pr-[16px] pt-[16px]">
        <div className="flex items-center justify-between">
          <Heading className="text-black" level={3}>
            &nbsp;
          </Heading>
          <ModalCloseButton
            className="text-black"
            onClick={() => {
              handleCaptchaModalClose();
            }}
          />
        </div>
        <div className="w-[340px] pl-[20px] pr-[20px]">
          <div className="font-clash text-[24px] font-[500] text-black">
            Complete the captcha
          </div>

          <div className="font-guise mb-[24px] mt-[20px] text-[12px] font-[500] text-black">
            Please complete the captcha to verify that you are not a robot.
          </div>

          {turnstileSiteKey && (
            <Turnstile
              className="w-full"
              sitekey={turnstileSiteKey}
              onVerify={setToken}
              theme="light"
              fixedSize={true}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
