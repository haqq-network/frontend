import { useWindowWidth } from '@haqq/shared';
import { Button } from '../button/button';
import { WarningMessage } from '../warning-message/warning-message';

interface ValidatorBlockMobile {
  delegation: string;
  rewards: string;
  undelegate?: string;
  isDelegateDisabled: boolean;
  isGetRewardDisabled: boolean;
  isUndelegateDisabled: boolean;
  onDelegateClick: () => void;
  onGetRewardClick: () => void;
  onUndelegateClick: () => void;
}

export function ValidatorBlockMobile({
  delegation,
  isDelegateDisabled,
  isGetRewardDisabled,
  isUndelegateDisabled,
  onDelegateClick,
  onGetRewardClick,
  onUndelegateClick,
  rewards,
  undelegate,
}: ValidatorBlockMobile) {
  return (
    <div className="flex w-full flex-col items-start gap-y-[16px] bg-[#252528] px-[16px] py-[24px] md:h-[296px] md:px-[48px] md:py-[40px] lg:hidden">
      <div className="inline-flex items-center gap-x-[8px] font-serif text-[16px] leading-[20px] text-white">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3 4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V9C21 10.1046 20.1046 11 19 11H5C3.89543 11 3 10.1046 3 9V4ZM19 4.4C19 4.17909 18.8209 4 18.6 4H5.4C5.17909 4 5 4.17909 5 4.4V8.6C5 8.82091 5.17909 9 5.4 9H18.6C18.8209 9 19 8.82091 19 8.6V4.4ZM7 7.1C7 7.32091 7.17909 7.5 7.4 7.5H8.6C8.82091 7.5 9 7.32091 9 7.1V5.9C9 5.67909 8.82091 5.5 8.6 5.5H7.4C7.17909 5.5 7 5.67909 7 5.9V7.1ZM10 7.1C10 7.32091 10.1791 7.5 10.4 7.5H11.6C11.8209 7.5 12 7.32091 12 7.1V5.9C12 5.67909 11.8209 5.5 11.6 5.5H10.4C10.1791 5.5 10 5.67909 10 5.9V7.1ZM3 15C3 13.8954 3.89543 13 5 13H19C20.1046 13 21 13.8954 21 15V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V15ZM18.6 20C18.8209 20 19 19.8209 19 19.6V15.4C19 15.1791 18.8209 15 18.6 15H5.4C5.17909 15 5 15.1791 5 15.4V19.6C5 19.8209 5.17909 20 5.4 20H18.6ZM7 18.1C7 18.3209 7.17909 18.5 7.4 18.5H8.6C8.82091 18.5 9 18.3209 9 18.1V16.9C9 16.6791 8.82091 16.5 8.6 16.5H7.4C7.17909 16.5 7 16.6791 7 16.9V18.1ZM10 18.1C10 18.3209 10.1791 18.5 10.4 18.5H11.6C11.8209 18.5 12 18.3209 12 18.1V16.9C12 16.6791 11.8209 16.5 11.6 16.5H10.4C10.1791 16.5 10 16.6791 10 16.9V18.1Z"
            fill="white"
          />
        </svg>
        Validator
      </div>
      <WarningMessage>
        While the validator is inactive, you will not be able to receive a
        reward.
      </WarningMessage>
      <div className="flex w-full flex-col gap-y-[12px] md:flex-row ">
        {/* 1 */}

        <div className="flex items-center justify-between md:w-[30%] md:flex-col md:items-start">
          <div className="font-sans text-[12px] font-semibold uppercase leading-[1.2em] text-white/50">
            My delegation
          </div>
          <div className="mt-[6px] font-serif uppercase text-white">
            {delegation} ISLM
          </div>
          <Button
            variant={2}
            onClick={onDelegateClick}
            disabled={isDelegateDisabled}
            className="mt-[12px] hidden w-full md:block "
          >
            Delegate
          </Button>
        </div>
        {/* 2 */}
        {undelegate && (
          <div className="sm flex items-center justify-between md:ml-[12px] md:w-[30%] md:flex-col md:items-start">
            <div className="font-sans text-[12px] font-semibold uppercase leading-[1.2em] text-white/50">
              Undelegate in process
            </div>
            <div className="mt-[6px] font-serif uppercase text-white">
              {undelegate} ISLM
            </div>
            <Button
              variant={2}
              onClick={onUndelegateClick}
              disabled={isUndelegateDisabled}
              className="mt-[12px] hidden w-full md:block "
            >
              Undelegate
            </Button>
          </div>
        )}

        {/* 3 */}
        <div className="flex items-center justify-between md:ml-[28px] md:w-1/3 md:flex-col md:items-start">
          <div className="font-sans text-[12px] font-semibold uppercase leading-[1.2em] text-white/50">
            My rewards
          </div>
          <div className="mt-[6px] font-serif uppercase text-[#01B26E]">
            {rewards} ISLM
          </div>
          <Button
            variant={5}
            onClick={onGetRewardClick}
            disabled={isGetRewardDisabled}
            className="mt-[12px] hidden w-full md:block"
          >
            Get my rewards
          </Button>
        </div>
      </div>
      <div className="inline-flex w-full gap-x-[12px]">
        <Button
          variant={2}
          onClick={onDelegateClick}
          disabled={isDelegateDisabled}
          className="w-1/2 md:hidden"
        >
          Delegate
        </Button>
        <Button
          variant={2}
          onClick={onUndelegateClick}
          disabled={isUndelegateDisabled}
          className="w-1/2 md:hidden"
        >
          Undelegate
        </Button>
      </div>
      <Button
        variant={5}
        onClick={onGetRewardClick}
        disabled={isGetRewardDisabled}
        className="w-full md:hidden"
      >
        Get my rewards
      </Button>
    </div>
  );
}
