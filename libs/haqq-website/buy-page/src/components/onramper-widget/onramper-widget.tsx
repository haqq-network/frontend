'use client';
import { useEffect, useRef } from 'react';

const onramperWidgetTheme = {
  primaryColor: '#fafafaff',
  secondaryColor: '#3f3f43',
  primaryTextColor: '#ffffffff',
  secondaryTextColor: '#ffffffff',
  containerColor: '#0d0d0eff',
  cardColor: '#ffffff26',
  borderRadius: '0.4rem',
  widgetBorderRadius: '0rem',
};

const onramperEndpoint = 'https://buy.onramper.com';

export function OnramperWidget({ apiKey }: { apiKey: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onramperUrl = new URL(onramperEndpoint);
  // onramperUrl.searchParams.set('apiKey', `pk_prod_${apiKey}`);
  // onramperUrl.searchParams.set('onlyCryptos', 'islm');
  onramperUrl.searchParams.set('onlyCryptos', 'eth');
  onramperUrl.searchParams.set('supportSell', 'false');
  onramperUrl.searchParams.set(
    'successRedirectUrl',
    encodeURIComponent('https://localhost:4200/buy/success'),
  );
  onramperUrl.searchParams.set(
    'failureRedirectUrl',
    encodeURIComponent('https://localhost:4200/buy/failed'),
  );

  console.log({ orl: onramperUrl.toString() });

  useEffect(() => {
    const iframeElement = iframeRef.current;
    if (iframeElement !== null) {
      const iframeWindow = iframeElement.contentWindow;

      if (iframeWindow !== null) {
        iframeWindow.postMessage(
          {
            type: 'change-theme',
            id: 'change-theme',
            theme: onramperWidgetTheme,
          },
          onramperEndpoint,
        );
      }
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={onramperUrl.toString()}
      title="Onramper Widget"
      height={630}
      width={420}
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    />
  );
}
