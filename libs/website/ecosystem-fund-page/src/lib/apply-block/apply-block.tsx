import { Button, Heading, Text } from '@haqq/website/ui-kit';
import Link from 'next/link';
import Image from 'next/image';
import bottomLinesImgData from '../../assets/apply-block-bottom-lines.svg';
import sideLinesImgData from '../../assets/apply-block-side-lines.svg';

//px-[16px] sm:px-[48px] lg:px-[112px] xl:px-[135px]
export function ApplyBlock() {
  return (
    <section className="flex flex-col relative text-center" id="apply">
      <div className="flex">
        <Image
          src={sideLinesImgData.src}
          alt=""
          height={sideLinesImgData.height}
          width={sideLinesImgData.width}
          // className="absolute top-0 right-0 z-[0]"
        />
        <div className="flex-1 py-[48px] sm:py-[60px] lg:py-[80px] px-[16px] sm:px-[48px] lg:px-[112px] xl:px-[135px]">
          <Text className="text-haqq-bigfoot-feet">
            Grants and Investment Program
          </Text>
          <Heading className="mt-[8px]">
            Apply now for the Haqq Ecosystem Fund, and let's{' '}
            <br className="hidden lg:block" />
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
          height={sideLinesImgData.height}
          width={sideLinesImgData.width}
          // className="absolute top-0 left-0 z-[0]"
        />
      </div>
      <div>
        <Image
          src={bottomLinesImgData.src}
          alt=""
          height={bottomLinesImgData.height}
          width={bottomLinesImgData.width}
          // className=" bottom-0 left-1/2 z-[0] transform -translate-x-1/2"
        />
      </div>
    </section>
  );
}
