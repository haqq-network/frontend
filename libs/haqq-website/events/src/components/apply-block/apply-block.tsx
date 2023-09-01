'use client';
import { ConnectButtons } from '../connect-buttons/connect-buttons';
import { useAddress, useQrRegistrationActions, useWallet } from '@haqq/shared';
import { useCallback, useState } from 'react';
import {
  QrRegistrationForm,
  QrRegistrationFormFields,
} from '@haqq/haqq-website/forms';
import { Button } from '@haqq/haqq-website-ui-kit';
import axios from 'axios';

const MESSAGE = 'GIVE ME TICKET';

async function submitForm(
  form: QrRegistrationFormFields & { signature: string },
) {
  return await axios.post<{ message: number } | { error: string }>(
    '/api/events/sign-up',
    form,
  );
}

export function ApplyBlock() {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { sign } = useQrRegistrationActions();

  const handleSubmit = useCallback(
    async (signupFormData: QrRegistrationFormFields) => {
      // console.log('handleSubmit', {
      //   ...signupFormData,
      //   signature,
      // });
      if (signature) {
        try {
          const response = await submitForm({
            ...signupFormData,
            signature,
          });
          console.log({ response });
          return;
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    },

    [signature],
  );

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
            <div className="mx-auto flex max-w-md flex-col gap-y-[24px] sm:gap-y-[32px]">
              <div>
                {ethAddress ? (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      const signature = await sign(ethAddress, MESSAGE);
                      setSignature(signature);
                    }}
                    disabled={Boolean(signature && signature.length > 0)}
                  >
                    Sign message
                  </Button>
                ) : (
                  <Button className="w-full" onClick={openSelectWallet}>
                    Connect wallet
                  </Button>
                )}

                <div>{signature}</div>
              </div>
              <QrRegistrationForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
