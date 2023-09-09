'use client';
import { useAddress, useQrRegistrationActions, useWallet } from '@haqq/shared';
import localStore from 'store2';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  QrRegistrationForm,
  QrRegistrationFormFields,
} from '@haqq/haqq-website/forms';
import { Button } from '@haqq/haqq-website-ui-kit';
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

export function ApplyBlock() {
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { sign } = useQrRegistrationActions();

  const localStKey = useMemo(() => {
    return `SAVED_SIGNATURE_KEY_${ethAddress}`;
  }, [ethAddress]);

  const savedSignature = useMemo(() => {
    return localStore.get(localStKey);
  }, [localStKey]);

  const [submitResult, setSubmitResult] = useState('');
  const [currentTicket, setCurrentTicket] = useState('');
  const [loading, setLoading] = useState(false);

  const checkRequest = useCallback(async (signature: string) => {
    setLoading(true);

    try {
      setCurrentTicket('');

      if (signature) {
        const ticketsData = await getTicket(signature);
        if (ticketsData.data.result.length > 0) {
          setCurrentTicket(ticketsData.data.result[0].ticket);
        } else {
          console.log('no tickets');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkRequest(savedSignature);
  }, [savedSignature, checkRequest]);

  const onSignHandler = useCallback(async () => {
    if (!ethAddress) {
      return;
    }
    const signature = await sign(ethAddress, MESSAGE);
    localStore.set(localStKey, signature);
    checkRequest(signature);
  }, [ethAddress, localStKey, sign, checkRequest]);

  const handleSubmit = useCallback(
    async (signupFormData: QrRegistrationFormFields) => {
      setCurrentTicket('');

      if (savedSignature) {
        try {
          const response = await submitForm({
            ...signupFormData,
            signature: savedSignature,
          });

          if (response.data.message) {
            checkRequest(savedSignature);
          } else {
            setSubmitResult(response.data.error);
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
    <div className="flex flex-1 flex-col items-center">
      <div className="mx-auto w-full max-w-sm">
        {submitResult && (
          <div className="flex flex-col space-y-[24px] leading-none sm:space-y-[32px]">
            {submitResult}
          </div>
        )}
        {currentTicket ? (
          <TickerRequest qrData={currentTicket} />
        ) : !savedSignature || loading ? (
          <div>
            {ethAddress ? (
              <Button className="w-full" onClick={onSignHandler}>
                Sign Event Registration Message
              </Button>
            ) : (
              <Button
                disabled={loading}
                className="w-full"
                onClick={openSelectWallet}
              >
                Connect wallet
              </Button>
            )}
          </div>
        ) : (
          <QrRegistrationForm
            onSubmit={handleSubmit}
            disabled={loading}
            className="w-full"
          />
          // <div className="mx-auto max-w-md">
          // </div>
        )}
      </div>
    </div>
  );
}
