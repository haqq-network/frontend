'use client';
import {  useDebouncedEffect } from '@haqq/shared';
import { useCallback, useState } from 'react';
import QrReader from 'react-qr-scanner'
import {  Button, SpinnerLoader } from '@haqq/haqq-website-ui-kit';
import axios from 'axios';


const verifyTicket = (data: { ticket: string }) => {
  return  axios.post<{ result: {success: boolean} }>(
    `/api/events/verify`,
    data
  );
}

const DELAY = 300;
const QR_STYLE = {
  height: 320,
  width: 400,
}

export function ScanBlock() {

  const [parsedTicket, setParsedTicket] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const checkRequest = useCallback(async () => {
    setLoading(true)

    try {
      if(parsedTicket) {
        const result = await verifyTicket({ ticket: parsedTicket })

        setIsVerified(result.data.result.success)
      }
    } finally {
      setLoading(false)
    }
  }, [parsedTicket])

  useDebouncedEffect(checkRequest)

  const handleScan = useCallback((data:any) => {
    if(data?.text) {
      setParsedTicket((prev:string) => {
        return prev !== data.text ? data.text : prev
      })
    }
  }, [])

  const handleError =useCallback( (err:any) => {
    console.error(err)
  }, [])

  const onReset = useCallback(() => {
    setParsedTicket('')
  }, [])

  return (
    <section className="py-20">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="flex flex-col gap-16">
          <div className="flex flex-1 flex-row items-center justify-between gap-[24px]">
            <div>
              <h2 className="font-serif text-[18px] font-[500] leading-[1.3em] sm:text-[24px] lg:text-[32px]">
                Event Scanner
              </h2>
            </div>

          </div>

          <div className="mx-auto flex max-w-md flex-col gap-y-[24px] sm:gap-y-[32px]">
            {(loading) ? <SpinnerLoader /> : 
              <>
                <QrReader
                  delay={DELAY}
                  style={QR_STYLE}
                  onError={handleError}
                  onScan={handleScan}
                  />

                {parsedTicket && <> 
                  {isVerified ? <div className="flex flex-col gap-y-[16px]">
                    Verified!
                  </div> : <div className="flex flex-col gap-y-[16px]">
                    Not Verified!
                  </div>}

                  {parsedTicket && <Button onClick={onReset}>
                    RESET
                  </Button>}
                </>}
              </>
          }
          </div>
          
        </div>
      </div>
    </section>
  );
}
