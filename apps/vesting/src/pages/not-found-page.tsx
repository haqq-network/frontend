import { Container } from '../components/Layout/Layout';

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[400px] flex-col content-center items-center justify-center py-16">
      <h1 className="text-bold block text-6xl">404</h1>
      <h2 className="text-medium block text-3xl">Page not found</h2>
    </Container>
  );
}
