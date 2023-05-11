import { Button } from '../button/button';
import { Heading } from '../heading/heading';

export function NotFoundPage() {
  return (
    <div className="w-full mx-auto px-[16px] sm:px-[48px] lg:px-[79px] lg:py-[34px] flex flex-col flex-1 items-center justify-center content-center min-h-[400px]">
      <Heading level={1}>404</Heading>
      <Heading level={2}>Page not found</Heading>

      <div className="mt-6">
        <Button
          variant={1}
          onClick={() => {
            window.history.back();
          }}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
