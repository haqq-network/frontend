import { useOnboarding } from '../OnboardingContainer';
import { Button } from '../components/Button/Button';
import { Heading, Text } from '../components/Typography/Typography';
import { Container } from '../components/Layout/Layout';
import { Navigate } from 'react-router-dom';
import { SwitchNetworkScreen } from '../components/SwitchNetworkScreen/SwitchNetworkScreen';

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
