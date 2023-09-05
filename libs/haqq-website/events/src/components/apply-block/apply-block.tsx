'use client';
import { ConnectButtons } from '../connect-buttons/connect-buttons';
import { useAddress, useLocalStorage, useQrRegistrationActions, useWallet } from '@haqq/shared';
import { useCallback, useEffect, useState } from 'react';
import {
  QrRegistrationForm,
  QrRegistrationFormFields,
} from '@haqq/haqq-website/forms';
import { Button, SpinnerLoader } from '@haqq/haqq-website-ui-kit';
import axios from 'axios';

const MESSAGE = 'GIVE ME TICKET';

async function submitForm(
  form: QrRegistrationFormFields & { signature: string },
) {
  return await axios.post<{ message: string, error: string }>(
    '/api/events/sign-up',
    form,
  );
}

async function verifySignature(ticket: string,) {
  return await axios.post<{ message: string, error: string }>(
    '/api/events/verify',
    { ticket },
  );
}

const SAVED_SIGNATURE_KEY = 'SAVED_SIGNATURE_KEY'

export function ApplyBlock() {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { sign } = useQrRegistrationActions();

  const [savedSignature, saveSignature] = useLocalStorage(SAVED_SIGNATURE_KEY, signature)

  const [submitResult, setSubmitResult] = useState('')
  const [loading, setLoading] = useState(!!savedSignature)

  const checkRequest = useCallback(async () => {
    setLoading(true)
    // check and update state

    try {
      if(savedSignature) {
        const result = await verifySignature(savedSignature)
      }
    } finally {
      setLoading(false)
    }
  }, [savedSignature])

  useEffect(() => {
    savedSignature && checkRequest()
  }, [checkRequest, savedSignature])

  const handleSubmit = useCallback(
    async (signupFormData: QrRegistrationFormFields) => {
      
      if (savedSignature) {
        try {
          const response = await submitForm({
            ...signupFormData,
            signature: savedSignature ,
          });
          console.log({ response: response.data.message });

          setSubmitResult(response.data.message || response.data.error)
          return;
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    },

    [savedSignature],
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

          {loading ? <SpinnerLoader /> : 
            <div className="mx-auto flex max-w-md flex-col gap-y-[24px] sm:gap-y-[32px]">
              <div>
                {ethAddress ? (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      const signature = await sign(ethAddress, MESSAGE);
                      setSignature(signature);
                      saveSignature(signature)
                      checkRequest()
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

              </div>
              {submitResult ? <div className='flex flex-col space-y-[24px] leading-none sm:space-y-[32px]'>{submitResult}</div> : <QrRegistrationForm onSubmit={handleSubmit} />}
            </div>
          }
        </div>
      </div>
    </section>
  );
}
