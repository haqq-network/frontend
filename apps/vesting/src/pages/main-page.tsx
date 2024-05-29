import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useWallet } from '@haqq/shell-shared';
import { Button } from '../components/Button/Button';
import { Container } from '../components/Layout/Layout';
import { Heading, Text } from '../components/typography';

export default function MainPage() {
  const { openSelectWallet } = useWallet();
  const { chain, isConnected } = useAccount();

  if (isConnected) {
    if (!chain) {
      return <Navigate to="/switch-network" />;
    } else {
      return <Navigate to="/account" />;
    }
  }

  return (
    <section className="flex flex-1">
      <Container>
        <div className="mx-auto max-w-5xl py-20">
          <div className="flex flex-col space-y-12">
            <Heading level={1}>
              Shariah-compliant <br />
              digital money
            </Heading>

            <div>
              <Text color="light" className="text-2xl leading-8">
                The currency of the HAQQ ecosystem.
                <br />
                Serves The Muslim Community.
                <br />
                Promotes Islamic values.
              </Text>
            </div>

            <div>
              <Button
                onClick={openSelectWallet}
                className="px-12"
                // disabled={!isWalletsEnabled}
              >
                Connect wallet
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
