import { Button } from '../button/button';
import { Heading } from '../heading/heading';
import { Ruler } from '../success-message-modal/success-message-modal';

export function FailureMessageModal() {
  return (
    <div className="relative flex items-center justify-between bg-white text-haqq-black rounded-[10px] max-w-[343px] sm:max-w-[473px] lg:max-w-[623px] px-[16px] sm:px-[32px] lg:px-[62px]">
      <div className="text-center mx-[70px] my-[45px]">
        <Heading className="mb-[24px] sm:mb-[32px]">
          Oops...
          <br /> Something went wrong
        </Heading>
        <Button variant={3} className="px-[18px] sm:px-[32px]">
          Try again
        </Button>
      </div>

      <Ruler className="absolute h-full w-auto top-0 left-[16px] sm:left-[32px] sm:h-[96%] sm:top-[2%]" />
      <Ruler className="absolute h-full w-auto top-0 right-[16px] sm:right-[32px] sm:h-[96%] sm:top-[2%] scale-x-[-1]" />
    </div>
  );
}
