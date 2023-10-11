import { Tooltip } from '@haqq/shell-ui-kit';
import { ReactNode } from 'react';

export function AirdropChallengeStatusFailed() {
  return (
    <div className="flex h-[20px] w-[20px] items-center justify-center leading-[0]">
      <div className="mb-[-2px] h-[8px] w-[8px] rounded-full bg-[#FF5454]" />
    </div>
  );
}

export function AirdropChallenge({
  label,
  result,
  tooltip,
}: {
  label: string;
  result: ReactNode;
  tooltip?: string;
}) {
  const content = (
    <div className="flex flex-1 cursor-default items-center justify-between gap-[12px] py-[8px] lg:py-[12px]">
      <div className="flex-1">
        <div className="font-guise text-[10px] font-[600] uppercase leading-[16px] text-white/50 lg:text-[12px]">
          {label}
        </div>
      </div>
      <div className="flex h-[26px] items-center">{result}</div>
    </div>
  );

  if (!tooltip) {
    return content;
  }

  return <Tooltip text={tooltip}>{content}</Tooltip>;
}

export function AirdropChallengeStatusSuccess() {
  return (
    <div className="text-islamic-primary-green leading-[0]">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
