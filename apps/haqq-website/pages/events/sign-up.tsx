import { QrRegistrationPage } from '@haqq/haqq-website/events';
import dynamic from 'next/dynamic';

const SignUpPage = () => {
  return (
    <QrRegistrationPage
      walletConnectProjectId={process.env['NX_WALLETCONNECT_PROJECT_ID']}
      isProduction={process.env['VERCEL_ENV'] === 'production'}
    />
  );
};

export default dynamic(
  () => {
    return Promise.resolve(SignUpPage);
  },
  {
    ssr: false,
  },
);
