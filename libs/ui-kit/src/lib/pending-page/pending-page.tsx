import { Container } from '../container/container';
import { SpinnerLoader } from '../loaders/loaders';

export function PendingPage() {
  return (
    <Container className="min-h-[400px] py-20 flex items-center justify-center content-center">
      <SpinnerLoader />
    </Container>
  );
}
