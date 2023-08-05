import Image from 'next/image';

export function MemberCard({ image, title }: { image: string; title: string }) {
  return (
    <div className="hover:border-islamic-primary-green flex h-[309px] w-[192px] cursor-pointer flex-col gap-y-[30px] rounded-[20px] border border-dashed border-[#585858] bg-transparent px-[16px] pb-[24px] pt-[16px] transition-colors duration-300 md:h-[301px] md:w-[236px] lg:h-[333px]">
      <div className="relative h-[180px] w-[160px] md:h-[180px] md:w-[200px]">
        <Image src={image} alt="" fill />
      </div>
      <span className="text-[13px] font-[300] leading-[20px] text-white md:text-[14px] lg:text-base">
        {title}
      </span>
    </div>
  );
}
