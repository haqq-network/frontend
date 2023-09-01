import { Fragment } from 'react';
import { ApplyBlock } from '../apply-block/apply-block';
import { WebsiteProviders } from '@haqq/shared';
import Head from 'next/head';
import { SelectWalletModalWrapper } from '../select-wallet-modal-wrapper';

export function QrRegistrationPage({
  walletConnectProjectId,
  isProduction,
}: {
  walletConnectProjectId: string | undefined;
  isProduction: boolean;
}) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Event Registration</title>
      </Head>

      <WebsiteProviders
        walletConnectProjectId={walletConnectProjectId}
        withReactQueryDevtools={isProduction}
        isStandalone
      >
        <SelectWalletModalWrapper>
          <ApplyBlock />
        </SelectWalletModalWrapper>
      </WebsiteProviders>
    </Fragment>
  );
}
