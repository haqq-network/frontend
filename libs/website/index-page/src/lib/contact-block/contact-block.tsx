import Image from 'next/image';
import eclipseImageData from '../../assets/images/eclipse.png';
import { ContactForm } from '@haqq/website/forms';
import { Heading } from '@haqq/website/ui-kit';

export function ContactBlock() {
  return (
    <div className="pt-[120px] pb-[148px] sm:py-[120px] lg:py-[136px] lg:min-h-[600px] relative px-[16px]">
      <Image
        alt=""
        src={eclipseImageData.src}
        fill
        className="z-[-1] object-cover"
      />

      <div className="max-w-full sm:max-w-[474px] lg:max-w-[556px] mx-auto">
        <div className="text-center mb-[24px] sm:mb-[32px]">
          <Heading level={2}>Develop your vision on HAQQ</Heading>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
