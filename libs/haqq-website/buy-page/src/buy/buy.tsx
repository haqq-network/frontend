'use client';

import { useRef } from 'react';

export function OnRamperBuy({ apiKey }: { apiKey: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframe = iframeRef.current;
  if (iframe) {
    iframe.contentWindow?.postMessage(
      {
        type: 'change-theme',
        id: 'change-theme',
        theme: {
          primaryColor: '#fafafaff',
          secondaryColor: '#3f3f43',
          primaryTextColor: '#ffffffff',
          secondaryTextColor: '#ffffffff',
          containerColor: '#0d0d0eff',
          cardColor: '#ffffff26',
          borderRadius: '0.4rem',
          widgetBorderRadius: '0rem',
        },
      },
      '*',
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={`https://buy.onramper.com/?apiKey=pk_prod_${apiKey}`}
      title="Onramper Widget"
      height="630px"
      width="420px"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    />
  );
}
