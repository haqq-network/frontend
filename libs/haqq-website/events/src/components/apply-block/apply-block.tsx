'use client';
import { ConnectButtons } from '../connect-buttons/connect-buttons';
import { useAddress, useQrRegistrationActions } from '@haqq/shared';
import { useEffect } from 'react';
import { QrRegistrationForm } from '@haqq/haqq-website/forms';
import { Text } from '@haqq/haqq-website-ui-kit';

// const MESSAGE = 'Welcome to Haqq QR Registration!';

export function ApplyBlock() {
  const { sign } = useQrRegistrationActions();

  const { ethAddress } = useAddress();

  useEffect(() => {
    if (ethAddress) {
      //sign(MESSAGE);
    }
  }, [sign, ethAddress]);

  return (
    <section className="py-20">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="flex flex-col gap-16">
          <div className="flex flex-1 flex-row items-center justify-between gap-[24px]">
            <div>
              <h2 className="font-serif text-[18px] font-[500] leading-[1.3em] sm:text-[24px] lg:text-[32px]">
                Event Registration
              </h2>
            </div>

            <ConnectButtons />
          </div>

          <div>
            <div className="mx-auto max-w-md">
              <QrRegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
