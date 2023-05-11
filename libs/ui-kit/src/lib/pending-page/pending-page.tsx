import { Container } from '../container/container';
import { SpinnerLoader } from '../loaders/loaders';

export function PendingPage() {
  return (
    <Container className="flex min-h-[400px] content-center items-center justify-center py-20">
      <SpinnerLoader />
    </Container>
  );
}
