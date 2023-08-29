import { Text } from '@haqq/website-ui-kit';
import bgImgData from '../../assets/lines.svg';
import { СonnectButtons } from '../connect-buttons/connect-buttons';
import { useAddress, useQrRegistrationActions } from '@haqq/shared';
import { useEffect } from 'react';

const MESSAGE = 'Welcome to Haqq QR Registration!';

export function ApplyBlock() {
  const { sign } = useQrRegistrationActions();

  const { ethAddress } = useAddress();

  useEffect(() => {
    if (ethAddress) {
      sign(MESSAGE);
    }
  }, [sign, ethAddress]);

  return (
    <section
      className="relative mb-[-46px] flex h-[362px] flex-col items-center bg-cover bg-center bg-no-repeat px-[16px] pt-[48px] text-center font-light sm:h-[380px] sm:px-[48px] sm:pt-[60px] lg:h-[446px] 2xl:mb-[-26px]"
      id="apply"
      style={{
        backgroundImage: `url(${bgImgData.src})`,
      }}
    >
      <div className="flex flex-row items-center gap-[24px]">
        <Text className="text-haqq-gold">QR-code registration</Text>

        <СonnectButtons />
      </div>
    </section>
  );
}
