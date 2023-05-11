import { PropsWithChildren } from 'react';

export function WarningMessage({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-row gap-[14px] rounded-[6px] bg-[#48361B] px-[16px] py-[12px] text-[#E3A13F]">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2303 3.2156C10.9802 1.79092 13.0202 1.79093 13.77 3.2156L22.1136 19.0685C22.8146 20.4003 21.8488 22 20.3438 22H3.65653C2.15151 22 1.18574 20.4003 1.8867 19.0685L10.2303 3.2156ZM12.0002 4.14709L3.65653 20L20.3438 20L12.0002 4.14709ZM11.0002 18V16H13.0002V18H11.0002ZM13.0002 15V10H11.0002V15H13.0002Z"
          fill="currentColor"
        />
      </svg>
      <div className="text-[12px] leading-[18px]">{children}</div>
    </div>
  );
}
