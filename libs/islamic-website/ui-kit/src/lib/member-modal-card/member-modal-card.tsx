import Image from 'next/image';
import { ModalCloseButton } from '../modal/modal';

interface MemberModalCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

export function MemberModalCard({
  onClick,
  description,
  image,
  title,
}: MemberModalCardProps) {
  return (
    <div className="flex max-w-[680px] flex-col items-center rounded-[20px] bg-[#15191EF2] px-[40px] pb-[48px] pt-[20px] text-white">
      <ModalCloseButton onClick={onClick} className="self-end outline-none" />
      <div className="flex flex-col items-center gap-[24px] pt-[4px] md:flex-row">
        <Image
          src={image}
          alt=""
          className="rounded-[20px]"
          height={148}
          width={164}
        />

        <div className="text-[24px] font-[700] leading-[34px]">{title}</div>
      </div>
      <div className="mt-[32px] text-[14px] leading-[20px]">{description}</div>
    </div>
  );
}
