import Image from 'next/image';
import eclipseImageData from '../../assets/images/eclipse.png';
import { ContactForm } from '@haqq/website/forms';
import { Heading } from '@haqq/website/ui-kit';

export function ContactBlock() {
  return (
    <div
      className="relative px-[16px] pb-[148px] pt-[120px] sm:py-[120px] lg:min-h-[600px] lg:py-[136px]"
      id="contact"
    >
      <Image
        alt=""
        src={eclipseImageData.src}
        fill
        className="z-[-1] object-cover"
      />

      <div className="mx-auto max-w-full sm:max-w-[474px] lg:max-w-[556px]">
        <div className="mb-[24px] text-center sm:mb-[32px]">
          <Heading level={2}>Develop your vision on HAQQ</Heading>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
