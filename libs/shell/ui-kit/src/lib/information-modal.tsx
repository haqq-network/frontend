import { ReactNode, useCallback } from 'react';
import { Button } from '../button/button';
import { Heading } from '../heading/heading';
import { Modal, ModalCloseButton } from '../modal/modal';

export const InformationModal = ({
  isOpened,
  setOpenState,
  title,
  message,
}: {
  isOpened: boolean;
  setOpenState: (v: boolean) => void;
  title: string;
  message: string | ReactNode;
}) => {
  const handleCaptchaModalClose = useCallback(() => {
    setOpenState(false);
  }, [setOpenState]);

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
        <div className="w-[398px] pl-[20px] pr-[20px]">
          <div className="font-clash text-[24px] font-[500] leading-[30px] text-black">
            {title}
          </div>

          <div className="font-guise mb-[24px] mt-[20px] text-[12px] font-[500] leading-[18px] text-black">
            {message}
          </div>

          <Button
            onClick={() => {
              handleCaptchaModalClose();
            }}
            variant={3}
            className="w-full"
          >
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  );
};
