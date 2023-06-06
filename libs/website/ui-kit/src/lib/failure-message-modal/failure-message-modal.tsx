import { Button } from '../button/button';
import { Heading } from '../heading/heading';
import { Ruler } from '../success-message-modal/success-message-modal';

export function FailureMessageModal() {
  return (
    <div className="text-haqq-black relative flex max-w-[343px] items-center justify-between rounded-[10px] bg-white px-[16px] sm:max-w-[473px] sm:px-[32px] lg:max-w-[623px] lg:px-[62px]">
      <div className="mx-[70px] my-[45px] text-center">
        <Heading className="mb-[24px] sm:mb-[32px]">
          Oops...
          <br /> Something went wrong
        </Heading>
        <Button variant={3} className="px-[18px] sm:px-[32px]">
          Try again
        </Button>
      </div>

      <Ruler className="absolute left-[16px] top-0 h-full w-auto sm:left-[32px] sm:top-[2%] sm:h-[96%]" />
      <Ruler className="absolute right-[16px] top-0 h-full w-auto scale-x-[-1] sm:right-[32px] sm:top-[2%] sm:h-[96%]" />
    </div>
  );
}
