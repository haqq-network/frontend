import clsx from 'clsx';
// import Image from 'next/image';
import { GradientText } from '@haqq/islamic-website-ui-kit';
import { DEXPair } from '../dex-pair/dex-pair';

interface DEXCardProps {
  pair: [string, string];
}

export function DEXCard({ pair }: DEXCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-row items-center gap-x-[12px] rounded-[20px] backdrop-blur-[6px] md:gap-x-[16px]',
        'bg-[#181E25B2] transition-colors duration-200 ease-in-out hover:bg-[#181E25] focus:bg-[#181E25] active:bg-[#181E25]',
        'p-[20px]',
      )}
    >
      <DEXPair pair={pair} />
      <div>
        <div className="ltr:font-vcr rtl:font-handjet text-[17px] font-[400] uppercase leading-[28px] md:text-[20px] md:leading-[34px]">
          {`${pair[0]}/${pair[1]}`}
        </div>

        <div className="font-alexandria text-[13px] font-[400] leading-[20px] md:text-[16px] md:leading-[24px]">
          <GradientText>Go to Swap</GradientText>
        </div>
      </div>
    </div>
  );
}
