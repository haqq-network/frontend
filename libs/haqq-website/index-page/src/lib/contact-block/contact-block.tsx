import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Heading } from '@haqq/haqq-website-ui-kit';
import eclipseImageData from '../../assets/images/index-page-contact-bg.png';

const FeedbackForm = dynamic(
  async () => {
    const { FeedbackForm } = await import('@haqq/haqq-website/forms');
    return { default: FeedbackForm };
  },
  {
    ssr: false,
  },
);

export function ContactBlock({
  turnstileSiteKey,
}: {
  turnstileSiteKey: string;
}) {
  return (
    <div
      className="relative px-[16px] pb-[148px] pt-[120px] sm:py-[120px] lg:min-h-[600px] lg:py-[136px]"
      id="contact"
    >
      <Image
        alt=""
        src={eclipseImageData.src}
        fill
        priority
        className="z-[-1] object-cover"
      />

      <div className="mx-auto max-w-full sm:max-w-[474px] lg:max-w-[556px]">
        <div className="mb-[24px] text-center sm:mb-[32px]">
          <Heading level={2}>Develop your vision on HAQQ</Heading>
        </div>

        <FeedbackForm turnstileSiteKey={turnstileSiteKey} />
      </div>
    </div>
  );
}
