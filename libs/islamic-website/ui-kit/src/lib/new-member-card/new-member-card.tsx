import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export function NewMemberCard({
  image,
  title,
  url,
  onClick,
  className,
  description,
}: {
  image: string;
  title: string;
  url?: string;
  onClick?: () => void;
  className?: string;
  description: string;
}) {
  return (
    <div
      className={clsx(
        'flex cursor-pointer select-none flex-col bg-transparent',
        'px-[16px] pb-[24px] pt-[16px] md:px-[18px] md:pb-[32px] md:pt-[20px] lg:px-[28px]',
        'hover:border-islamic-primary-green rounded-[20px] border border-dashed border-[#585858]',
        'transition-colors duration-300',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-x-[20px]">
        <div className="relative h-[180px] w-[160px] overflow-hidden rounded-[20px] md:w-[200px]">
          <Image
            src={image}
            alt={title}
            fill
            className="pointer-events-none h-full w-full select-none object-cover"
          />
        </div>
        <div className="flex max-w-[40%] flex-col justify-between gap-[8px] md:gap-[12px]">
          <span className="text-[13px] font-[700] leading-[20px] md:text-[14px] lg:text-[24px] lg:leading-[34px]">
            {title}
          </span>

          {url && (
            <div>
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className={clsx(
                  'text-islamic-primary-green hover:text-islamic-primary-green-hover rtl:font-handjet font-mono  uppercase',
                  'inline-flex flex-row items-center gap-x-[4px]',
                  'transition-colors duration-300',
                )}
              >
                <span>Web</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.52795 8.52868C6.26759 8.78903 6.26759 9.21114 6.52795 9.47149C6.78829 9.73184 7.2104 9.73184 7.47075 9.47149L12.9993 3.94289V6.00008C12.9993 6.36827 13.2978 6.66675 13.666 6.66675C14.0342 6.66675 14.3327 6.36827 14.3327 6.00008L14.3327 2.33353V2.33342C14.3327 2.2423 14.3144 2.15546 14.2813 2.07635C14.2501 2.00166 14.2048 1.93149 14.1452 1.86996L14.1447 1.86935C14.1399 1.86442 14.135 1.85956 14.1301 1.85478L14.1299 1.8546C14.0683 1.79485 13.9979 1.74936 13.9231 1.71811C13.844 1.68503 13.7571 1.66675 13.666 1.66675L9.99935 1.66675C9.63116 1.66675 9.33268 1.96522 9.33268 2.33341C9.33268 2.7016 9.63116 3.00008 9.99935 3.00008L12.0565 3.00008L6.52795 8.52868ZM3.66602 1.99997C2.56145 1.99997 1.66602 2.8954 1.66602 3.99997V12.3333C1.66602 13.4379 2.56145 14.3333 3.66602 14.3333H11.9993C13.1039 14.3333 13.9993 13.4379 13.9993 12.3333V8.99997C13.9993 8.63178 13.7009 8.3333 13.3327 8.3333C12.9645 8.3333 12.666 8.63178 12.666 8.99997V12.3333C12.666 12.7015 12.3675 13 11.9993 13H3.66602C3.29783 13 2.99935 12.7015 2.99935 12.3333V3.99997C2.99935 3.63178 3.29783 3.3333 3.66602 3.3333H6.99935C7.36754 3.3333 7.66602 3.03483 7.66602 2.66664C7.66602 2.29845 7.36754 1.99997 6.99935 1.99997H3.66602Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[28px] line-clamp-2 text-[14px] leading-[20px] text-white/50">
        {description}
      </div>
    </div>
  );
}
