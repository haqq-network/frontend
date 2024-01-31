import { Navigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { Container } from '../components/Layout/Layout';
import { SwitchNetworkScreen } from '../components/SwitchNetworkScreen/SwitchNetworkScreen';
import { Heading, Text } from '../components/Typography/Typography';
import { useOnboarding } from '../OnboardingContainer';

export function WelcomeScreen() {
  const { connectWallet } = useOnboarding();

  return (
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
        <Button onClick={connectWallet} className="px-10">
          Connect wallet
        </Button>
      </div>
    </div>
  );
}

export function MainPage() {
  const { step } = useOnboarding();

  return (
    <section className="flex-1">
      <Container>
        {step === 'start' && (
          <div className="mx-auto max-w-5xl py-20">
            <WelcomeScreen />
          </div>
        )}

        {step === 'switch-network' && (
          <div className="mx-auto max-w-[600px] py-20">
            <SwitchNetworkScreen />
          </div>
        )}

        {step === 'finish' && <Navigate to="/account" />}
      </Container>
    </section>
  );
}
