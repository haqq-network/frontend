'use client';
import { ConnectButtons } from '../connect-buttons/connect-buttons';
import {
  useAddress,
  useDebouncedEffect,
  useLocalStorage,
  useQrRegistrationActions,
  useWallet,
} from '@haqq/shared';
import { Fragment, useCallback, useState } from 'react';
import {
  QrRegistrationForm,
  QrRegistrationFormFields,
} from '@haqq/haqq-website/forms';
import { Button, SpinnerLoader } from '@haqq/haqq-website-ui-kit';
import axios from 'axios';
import { TickerRequest } from '../ticket-request/ticket-request';

const MESSAGE = 'GIVE ME TICKET';

interface TicketEntity {
  ticket: string;
}

async function submitForm(
  form: QrRegistrationFormFields & { signature: string },
) {
  return await axios.post<{ message: string; error: string }>(
    '/api/events/sign-up',
    form,
  );
}

const getTicket = (signature: string) => {
  return axios.get<{ result: TicketEntity[] }>(
    `/api/events/get-tickets?signature=${signature}`,
  );
};

const SAVED_SIGNATURE_KEY = 'SAVED_SIGNATURE_KEY';

export function ApplyBlock() {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { sign } = useQrRegistrationActions();

  const [savedSignature, saveSignature] = useLocalStorage(
    SAVED_SIGNATURE_KEY,
    signature,
  );

  const [submitResult, setSubmitResult] = useState('');
  const [currentTicket, setCurrentTicket] = useState('');
  const [loading, setLoading] = useState(!!savedSignature);

  const checkRequest = useCallback(async () => {
    setLoading(true);

    try {
      if (savedSignature) {
        const ticketsData = await getTicket(savedSignature);
        ticketsData.data.result[0] &&
          setCurrentTicket(ticketsData.data.result[0].ticket);
      }
    } finally {
      setLoading(false);
    }
  }, [savedSignature]);

  useDebouncedEffect(checkRequest);

  const handleSubmit = useCallback(
    async (signupFormData: QrRegistrationFormFields) => {
      if (savedSignature) {
        try {
          const response = await submitForm({
            ...signupFormData,
            signature: savedSignature,
          });
          console.log({ response: response.data.message });

          if(response.data.message ){
            checkRequest()
          } else {
            setSubmitResult(response.data.error)
          }

          return;
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    },

    [savedSignature, checkRequest],
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
          </div>

          <div className="mx-auto flex max-w-md flex-col gap-y-[24px] sm:gap-y-[32px]">
            {loading ? (
              <SpinnerLoader />
            ) : (
              currentTicket ? (
                <TickerRequest qrData={currentTicket} />
              ) : (
                <QrRegistrationForm onSubmit={handleSubmit} signBlock={!savedSignature ? (
                  <div>
                    {ethAddress ? (
                      <Button
                        className="w-full"
                        onClick={async () => {
                          const signature = await sign(ethAddress, MESSAGE);
                          setSignature(signature);
                          saveSignature(signature);
                          checkRequest();
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
                ) : null} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
