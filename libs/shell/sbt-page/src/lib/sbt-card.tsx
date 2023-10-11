import clsx from 'clsx';

export type SBTStatus = 'not-complete' | 'process' | 'complete';

export function SBTCardStatus({
  status,
  className,
}: {
  status: SBTStatus;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-[4px] rounded-[8px] p-[12px]',
        'font-clash text-[14px] font-[500] uppercase tracking-[0.01em]',
        status === 'not-complete'
          ? 'bg-[#AAABB2] text-[#0D0D0E]'
          : {
              'bg-[#E3A13F] text-white': status === 'process',
              'bg-[#01B26E] text-white': status === 'complete',
            },
        className,
      )}
    >
      <span className="mb-[-2px] inline-block">
        {status === 'not-complete' && 'Not complete'}
        {status === 'process' && 'In process'}
        {status === 'complete' && 'Complete'}
      </span>
    </div>
  );
}

export function SBTCard({
  status,
  img,
  title,
}: {
  status: SBTStatus;
  img: string;
  title: string;
}) {
  return (
    <div className="rounded-[8px] border-[1.5px] border-[#FFFFFF3D] p-[24px] transition-colors duration-150 ease-in hover:border-[#EC5728] lg:p-[28px]">
      <div className="mb-[20px] lg:mb-[24px]">
        <SBTCardStatus status={status} />
      </div>

      <div className="h-[180px] w-full overflow-hidden rounded-[8px]">
        <img src={img} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="my-[16px] lg:my-[20px]">
        <div className="line-clamp-2 h-[44px] font-sans text-[14px] font-[500] leading-[22px] text-white lg:h-[52px] lg:h-[56px] lg:text-[17px] lg:text-[18px] lg:leading-[26px] lg:leading-[28px]">
          {title}
        </div>
      </div>

      <div className="border-t border-dashed border-[#FFFFFF3D] pt-[16px] lg:pt-[20px]">
        <div className="flex flex-row items-center gap-[12px]">
          <div>
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.0001 38.5001C26.7854 38.5001 31.095 36.463 34.1088 33.2086C32.0849 34.4708 29.6943 35.2001 27.1334 35.2001C19.8433 35.2001 13.9334 29.2902 13.9334 22.0001C13.9334 14.7099 19.8433 8.80008 27.1334 8.80008C29.6943 8.80008 32.0849 9.52935 34.1088 10.7916C31.095 7.5372 26.7854 5.50008 22.0001 5.50008C12.8874 5.50008 5.50008 12.8874 5.50008 22.0001C5.50008 31.1128 12.8874 38.5001 22.0001 38.5001ZM38.5001 22.0127C38.4933 25.5507 35.623 28.4167 32.0834 28.4167C28.5396 28.4167 25.6667 25.5439 25.6667 22.0001C25.6667 18.4563 28.5396 15.5834 32.0834 15.5834C35.6225 15.5834 38.4923 18.4485 38.5001 21.9857C38.5001 21.9905 38.5001 21.9953 38.5001 22.0001C38.5001 22.0043 38.5001 22.0085 38.5001 22.0127ZM35.7816 14.6234C34.6692 14.0646 33.413 13.7501 32.0834 13.7501C27.5271 13.7501 23.8334 17.4437 23.8334 22.0001C23.8334 26.5564 27.5271 30.2501 32.0834 30.2501C33.413 30.2501 34.6692 29.9355 35.7816 29.3768C33.6967 31.8186 30.5959 33.3667 27.1334 33.3667C20.8558 33.3667 15.7668 28.2777 15.7668 22.0001C15.7668 15.7224 20.8558 10.6334 27.1334 10.6334C30.5959 10.6334 33.6967 12.1815 35.7816 14.6234ZM40.3334 21.9856L40.3334 21.9669C40.3155 11.8569 32.1142 3.66675 22.0001 3.66675C11.8749 3.66675 3.66675 11.8749 3.66675 22.0001C3.66675 32.1253 11.8749 40.3334 22.0001 40.3334C32.1142 40.3334 40.3155 32.1432 40.3334 22.0333L40.3334 22.0146C40.3334 22.0098 40.3334 22.0049 40.3334 22.0001C40.3334 21.9952 40.3334 21.9904 40.3334 21.9856Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="text-[12px] font-[500] leading-[18px] text-[#8E8E8E]">
              Reward
            </div>
            <div className="font-clash text-[20px] font-[500] leading-[28px] text-[#8E8E8E]">
              <span className="text-white">SBT</span> Token
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
