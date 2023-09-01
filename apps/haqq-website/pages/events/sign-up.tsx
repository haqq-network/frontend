import { QrRegistrationPage } from '@haqq/haqq-website/events';

export default function SignUpPage() {
  return (
    <QrRegistrationPage
      walletConnectProjectId={process.env['NX_WALLETCONNECT_PROJECT_ID']}
      isProduction={process.env['VERCEL_ENV'] === 'production'}
    />
  );
}
