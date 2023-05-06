import { Button, Heading, Text } from '@haqq/website/ui-kit';
import Link from 'next/link';
import Image from 'next/image';
import bottomLinesImgData from '../../assets/apply-block-bottom-lines.svg';
import sideLinesImgData from '../../assets/apply-block-side-lines.svg';

// px-[16px] sm:px-[48px] lg:px-[112px] xl:px-[135px]
// px-[64px]
export function ApplyBlock() {
  return (
    <section
      className={'flex items-center flex-col relative text-center'}
      id="apply"
    >
      <div className="flex w-full">
        <Image
          src={sideLinesImgData.src}
          alt=""
          width={sideLinesImgData.width}
          height={sideLinesImgData.height}
          className="left-[64px] hidden absolute top-0 xl:block"
        />
        <Image
          src={sideLinesImgData.src}
          alt=""
          width={sideLinesImgData.width}
          height={sideLinesImgData.height}
          className="left-[171px] hidden absolute top-0 xl:block"
        />
        <div className="flex-1 my-[48px] sm:my-[60px] lg:my-[80px] xl:mx-[134px]">
          <Text className="text-haqq-bigfoot-feet">
            Grants and Investment Program
          </Text>
          <Heading className="mt-[8px]">
            Apply now for the Haqq Ecosystem Fund, and let's{' '}
            <br className="hidden absolute top-0 lg:block" />
            make a difference together!
          </Heading>
          <Link
            href={'https://forms.gle/cf38bWNKRSEGV2b48'}
            target="_blank"
            rel={'noopener noreferrer'}
          >
            <Button variant={2} className="uppercase mt-[24px]">
              Apply now
            </Button>
          </Link>
        </div>
        <Image
          src={sideLinesImgData.src}
          alt=""
          width={sideLinesImgData.width}
          height={sideLinesImgData.height}
          className="right-[64px] hidden absolute top-0 xl:block"
        />
        <Image
          src={sideLinesImgData.src}
          alt=""
          width={sideLinesImgData.width}
          height={sideLinesImgData.height}
          className="right-[171px] hidden absolute xl:block"
        />
      </div>

      {/* <Image
        src={bottomLinesImgData.src}
        alt=""
        height={bottomLinesImgData.height}
        width={bottomLinesImgData.width}
        className="absolute"
      /> */}
    </section>
  );
}
