import { PropsWithChildren } from 'react';
import Image, { StaticImageData } from 'next/image';

export function DEXBlock({
  children,
  name,
  logo,
}: PropsWithChildren<{ name: string; logo: string | StaticImageData }>) {
  return (
    <div className="rounded-[20px] border-[1px] border-[#2F2F2F] p-[24px] md:p-[40px]">
      <div className="flex flex-row items-center gap-[16px]">
        <div className="relative h-[40px] w-[40px] overflow-hidden md:h-[48px] md:w-[48px]">
          <Image src={logo} alt={`${name} logo`} fill />
        </div>
        <div className="font-vcr rtl:font-handjet text-[18px] font-[400] uppercase leading-[26px] md:text-[24px] md:leading-[34px]">
          {name}
        </div>
      </div>
      <div className="mt-[16px] grid grid-cols-1 gap-[16px] md:mt-[36px] md:grid-cols-2 md:gap-[24px] lg:grid-cols-3 xl:grid-cols-4 xl:gap-[36px]">
        {children}
      </div>
    </div>
  );
}
