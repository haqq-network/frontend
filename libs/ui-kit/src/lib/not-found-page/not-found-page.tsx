import { Button2 } from '../button/button';
import { Container } from '../container/container';
import { Heading } from '../typography/typography';

export function NotFoundPage() {
  return (
    <Container className="min-h-[400px] py-16 flex flex-col items-center justify-center content-center">
      <Heading level={1}>404</Heading>
      <Heading level={2}>Page not found</Heading>

      <div className="mt-6 w-[120px]">
        <Button2
          fill
          onClick={() => {
            window.history.back();
          }}
        >
          Go back
        </Button2>
      </div>
    </Container>
  );
}
