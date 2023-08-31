import clsx from 'clsx';
import { Button } from '../button/button';
import { Heading } from '../heading/heading';

interface CookiesBannerProps {
  onClose: () => void;
  className?: string;
}

export function CookiesBanner({ onClose, className }: CookiesBannerProps) {
  return (
    <div
      className={clsx(
        'fixed flex w-full flex-col items-center justify-center space-y-[16px] bg-white px-[20px] pb-[24px] pt-[32px] sm:flex-row sm:space-x-[24px] sm:space-y-0 sm:px-[64px] sm:py-[30px]',
        className,
      )}
    >
      <Heading level={3} className="text-haqq-black text-center">
        Our website uses cookies to ensure maximum user experience.
      </Heading>
      <Button variant={3} onClick={onClose}>
        Okay
      </Button>
    </div>
  );
}
