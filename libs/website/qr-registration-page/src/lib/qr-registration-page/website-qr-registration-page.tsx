import { Fragment } from 'react';
import { ApplyBlock } from '../apply-block/apply-block';
import { WebsiteProviders } from '@haqq/shared';
import Head from 'next/head';
import { environment } from '../../environments/environment';
import { AppWrapper } from '../../app/app-wrapper';

export function QrRegistrationPage() {
  return (
    <WebsiteProviders
      walletConnectProjectId={environment.walletConnectProjectId}
      withReactQueryDevtools={!environment.isProduction}
      isStandalone
    >
      <AppWrapper>
        <Fragment>
          <Head>
            <title>HAQQ | QR Registration</title>
          </Head>
          <ApplyBlock />
        </Fragment>
      </AppWrapper>
    </WebsiteProviders>
  );
}
