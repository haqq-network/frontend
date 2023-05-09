import { useCallback } from 'react';
import { useOnboarding } from '../OnboardingContainer';
import { Button } from '../components/Button/Button';
import { Heading, Text } from '../components/Typography/Typography';
import { Container } from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { AddNetworkScreen } from '../components/AddNetworkScreen/AddNetworkScreen';
import { SwitchNetworkScreen } from '../components/SwitchNetworkScreen/SwitchNetworkScreen';

export function WelcomeScreen() {
  const { connectWallet, isConnected } = useOnboarding();
  const navigate = useNavigate();

  const handleGoToAccount = useCallback(() => {
    navigate('account');
  }, [navigate]);

  return (
    <div className="flex flex-col space-y-12">
      <Heading level={1}>
        Shariah-compliant <br />
        digital money
      </Heading>

      <div>
        <Text color="light" className="leading-8 text-2xl">
          The currency of the HAQQ ecosystem.
          <br />
          Serves The Muslim Community.
          <br />
          Promotes Islamic values.
        </Text>
      </div>

      <div>
        {isConnected ? (
          <Button onClick={handleGoToAccount} className="px-10">
            Go to account
          </Button>
        ) : (
          <Button onClick={connectWallet} className="px-10">
            Connect wallet
          </Button>
        )}
      </div>
    </div>
  );
}

export function MainPage() {
  const { step } = useOnboarding();

  return (
    <section className="flex-1">
      <Container>
        {(step === 'start' || step == 'finish') && (
          <div className="py-20 mx-auto max-w-5xl">
            <WelcomeScreen />
          </div>
        )}

        {step === 'switch-network' && (
          <div className="py-20 mx-auto max-w-[600px]">
            <SwitchNetworkScreen />
          </div>
        )}

        {step === 'add-network' && (
          <div className="py-20 mx-auto max-w-[600px]">
            <AddNetworkScreen />
          </div>
        )}
      </Container>
    </section>
  );
}
