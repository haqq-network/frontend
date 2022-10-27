import { Container } from '../components/Layout/Layout';

export function NotFoundPage() {
  return (
    <Container className="min-h-[400px] py-16 flex flex-col items-center justify-center content-center">
      <h1 className="block text-bold text-6xl">404</h1>
      <h2 className="block text-medium text-3xl">Page not found</h2>
    </Container>
  );
}
