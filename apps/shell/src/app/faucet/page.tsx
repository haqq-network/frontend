import dynamic from 'next/dynamic';
// import { FaucetPage } from '@haqq/shell-faucet';

const AuthProvider = dynamic(
  async () => {
    const { AuthProvider } = await import('@haqq/shell-faucet');
    return { default: AuthProvider };
  },
  { ssr: false },
);

const FaucetPage = dynamic(
  async () => {
    const { FaucetPage } = await import('@haqq/shell-faucet');
    return { default: FaucetPage };
  },
  { ssr: false },
);

export default function Faucet() {
  return (
    <AuthProvider>
      <FaucetPage />
    </AuthProvider>
  );
}
