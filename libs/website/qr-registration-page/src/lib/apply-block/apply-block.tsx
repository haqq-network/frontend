import { Text } from '@haqq/website-ui-kit';
import bgImgData from '../../assets/lines.svg';
import { СonnectButtons } from '../connect-buttons/connect-buttons';
import { useAddress, useQrRegistrationActions } from '@haqq/shared';
import { useEffect } from 'react';
import { QrRegistrationForm } from '@haqq/islamic-website/forms';

const MESSAGE = 'Welcome to Haqq QR Registration!';

export function ApplyBlock() {
  const { sign } = useQrRegistrationActions();

  const { ethAddress } = useAddress();

  useEffect(() => {
    if (ethAddress) {
      //sign(MESSAGE);
    }
  }, [sign, ethAddress]);

  return (
    <section className="relative mb-20 flex flex-col items-center bg-cover bg-center bg-no-repeat px-[16px] pt-[48px] text-center font-light sm:px-[48px] sm:pt-[60px] 2xl:mb-[-26px]">
      <div className="flex flex-row items-center gap-[24px]">
        <Text className="text-haqq-gold">QR-code registration</Text>

        <СonnectButtons />
      </div>

      <QrRegistrationForm />
    </section>
  );
}
