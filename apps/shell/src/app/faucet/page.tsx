import { AuthProvider, FaucetPage } from '@haqq/shell-faucet';

const auth0Config = {
  domain: process.env['SHELL_FAUCET_AUTH0_DOMAIN'] as string,
  clientId: process.env['SHELL_FAUCET_AUTH0_CLIENT_ID'] as string,
};

export default async function Faucet() {
  return (
    <AuthProvider auth0Config={auth0Config}>
      <FaucetPage />
    </AuthProvider>
  );
}
