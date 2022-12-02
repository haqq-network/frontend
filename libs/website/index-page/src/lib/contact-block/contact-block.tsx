import { Button, Heading, Input, Textarea } from '@haqq/website/ui-kit';
import Image from 'next/image';
import eclipseImageData from '../../assets/eclipse.png';

export function ContactBlock() {
  return (
    <div className="pt-[120px] pb-[148px] sm:py-[120px] lg:py-[136px] lg:min-h-[600px] relative px-[16px]">
      <Image
        alt=""
        src={eclipseImageData.src}
        fill
        className="z-[-1] object-cover"
      />

      <div className="max-w-full sm:max-w-[474px] lg:max-w-[556px] flex flex-col space-y-[24px] sm:space-y-[32px] mx-auto">
        <div className="text-center">
          <Heading level={2}>Develop your vision on HAQQ</Heading>
        </div>

        <div className="flex flex-col space-y-[12px] lg:space-y-[16px]">
          <div className="flex flex-col space-y-[12px] sm:space-y-0 sm:flex-row sm:space-x-[12px] lg:space-x-[16px]">
            <div className="flex-1">
              <Input className="w-full" placeholder="Name" required />
            </div>
            <div className="flex-1">
              <Input
                className="w-full"
                placeholder="Email"
                type="email"
                required
              />
            </div>
          </div>
          <div>
            <Textarea
              className="w-full h-[120px]"
              placeholder="Send us a message"
            />
          </div>
        </div>

        <div className="text-center">
          <Button className="w-[200px]" variant={2}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
