'use client';
import { useCallback, useState } from 'react';
import axios from 'axios';
import QrReader from 'react-qr-scanner';
import { Button, SpinnerLoader } from '@haqq/haqq-website-ui-kit';
import { useDebouncedEffect } from '@haqq/shell-shared';

interface IScanResult {
  text: string;
}

const verifyTicket = (data: { ticket: string }) => {
  return axios.post<{ result: { success: boolean } }>(
    `/api/events/verify`,
    data,
  );
};

const DELAY = 300;
const QR_STYLE = {
  height: 320,
  width: 400,
};

export function ScanBlock() {
  const [parsedTicket, setParsedTicket] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const checkRequest = useCallback(async () => {
    setLoading(true);

    try {
      if (parsedTicket) {
        const result = await verifyTicket({ ticket: parsedTicket });

        setIsVerified(result.data.result.success);
      }
    } finally {
      setLoading(false);
    }
  }, [parsedTicket]);

  useDebouncedEffect(checkRequest);

  const handleScan = useCallback((data: IScanResult) => {
    if (data?.text) {
      setParsedTicket((prev: string) => {
        return prev !== data.text ? data.text : prev;
      });
    }
  }, []);

  const handleError = useCallback((err: IScanResult) => {
    console.error(err);
  }, []);

  const onReset = useCallback(() => {
    setParsedTicket('');
    setIsVerified(false);
  }, []);

  return (
    <div
      className={`mx-auto flex max-w-md flex-col gap-y-[24px] sm:gap-y-[32px] `}
    >
      {loading ? (
        <SpinnerLoader />
      ) : (
        <>
          <div
            className={`flex flex-col gap-y-[16px] ${
              isVerified ? 'border-[15px] border-[green]' : ''
            }`}
          >
            <QrReader
              delay={DELAY}
              style={QR_STYLE}
              onError={handleError}
              onScan={handleScan}
              constraints={{
                video: { facingMode: 'environment' },
              }}
            />
          </div>

          {parsedTicket && (
            <>
              {isVerified ? (
                <div className="flex flex-col items-center gap-y-[16px] text-[24px] font-[600] uppercase text-[green]">
                  Verified!
                </div>
              ) : (
                <div className="flex flex-col items-center gap-y-[16px] text-[24px] font-[600] uppercase text-[red]">
                  Not Verified!
                </div>
              )}

              {parsedTicket && (
                <Button
                  variant={2}
                  className="w-full !px-[16px]"
                  onClick={onReset}
                >
                  RESET
                </Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
