import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface DownloadPDFButtonProps {
  language: 'en' | 'ar' | 'id';
  type?: 'fatwa' | 'whitepaper';
  url: string;
}

export function DownloadPDFButton({
  language,
  url,
  type = 'fatwa',
}: DownloadPDFButtonProps) {
  const t = useTranslations('ui-kit.download-pdf-button');
  return (
    <div className="hover:text-islamic-primary-green-hover hover:border-islamic-primary-green-hover w-[164px] cursor-pointer rounded-[8px] border border-white px-[10px] py-[6px] text-white transition-colors duration-300 md:w-[180px]">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between"
        download
      >
        <div className="flex gap-x-[8px]">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 5.75C8 5.19772 8.44772 4.75 9 4.75H18V11.75C18 13.4069 19.3431 14.75 21 14.75H28V30.25C28 30.8023 27.5523 31.25 27 31.25H9C8.44771 31.25 8 30.8023 8 30.25V5.75ZM20 11.75V5.12549L27.6866 12.3851C27.7957 12.4881 27.8789 12.613 27.9321 12.75H21C20.4477 12.75 20 12.3023 20 11.75ZM9 2.75C7.34315 2.75 6 4.09315 6 5.75V30.25C6 31.9069 7.34315 33.25 9 33.25H27C28.6569 33.25 30 31.9069 30 30.25V13.1121C30 12.2867 29.6599 11.4978 29.0599 10.9311L21.2647 3.56896C20.7078 3.04301 19.9708 2.75 19.2048 2.75H9ZM10.8 28.3867V22.75H13.2023C14.4601 22.75 15.2726 23.5391 15.2726 24.7461V24.7539C15.2726 25.9609 14.4601 26.7344 13.2023 26.7344H12.2336V28.3867H10.8ZM12.8586 23.8477H12.2336V25.6562H12.8586C13.4641 25.6562 13.8234 25.3398 13.8234 24.7539V24.7461C13.8234 24.1602 13.4641 23.8477 12.8586 23.8477ZM15.9094 28.3867V22.75H18.1984C19.8976 22.75 20.9016 23.7344 20.9016 25.5273V25.5352C20.9016 27.3359 19.8976 28.3867 18.1984 28.3867H15.9094ZM17.343 27.2305H18.0109C18.9445 27.2305 19.4445 26.6641 19.4445 25.5391V25.5312C19.4445 24.4766 18.9133 23.9062 18.0109 23.9062H17.343V27.2305ZM21.5969 22.75V28.3867H23.0305V26.2852H25.2141V25.1875H23.0305V23.9023H25.4328V22.75H21.5969Z"
              fill="currentColor"
            />
          </svg>

          <div className="flex flex-col text-[12px] font-[400] leading-[1.5em]">
            <span className="rtl:font-handjet ltr:font-vcr uppercase">
              {type === 'fatwa' && t('type.fatwa')}
              {type === 'whitepaper' && t('type.whitepaper')}
            </span>
            <span>{t(`language.${language}`)}</span>
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="justify-self-end"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.5299 8.52868C6.26955 8.78903 6.26955 9.21114 6.5299 9.47149C6.79025 9.73184 7.21236 9.73184 7.47271 9.47149L13.0013 3.94289V6.00008C13.0013 6.36827 13.2998 6.66675 13.668 6.66675C14.0362 6.66675 14.3346 6.36827 14.3346 6.00008L14.3346 2.33353V2.33341C14.3346 2.2423 14.3164 2.15546 14.2833 2.07635C14.2521 2.00166 14.2067 1.93149 14.1472 1.86996L14.1466 1.86935C14.1418 1.86442 14.137 1.85956 14.132 1.85478L14.1318 1.8546C14.0702 1.79485 13.9999 1.74936 13.925 1.71811C13.8459 1.68503 13.7591 1.66675 13.668 1.66675H10.0013C9.63311 1.66675 9.33464 1.96522 9.33464 2.33341C9.33464 2.7016 9.63311 3.00008 10.0013 3.00008L12.0585 3.00008L6.5299 8.52868ZM3.66797 1.99997C2.5634 1.99997 1.66797 2.8954 1.66797 3.99997V12.3333C1.66797 13.4379 2.5634 14.3333 3.66797 14.3333H12.0013C13.1059 14.3333 14.0013 13.4379 14.0013 12.3333V8.99997C14.0013 8.63178 13.7028 8.3333 13.3346 8.3333C12.9664 8.3333 12.668 8.63178 12.668 8.99997V12.3333C12.668 12.7015 12.3695 13 12.0013 13H3.66797C3.29978 13 3.0013 12.7015 3.0013 12.3333V3.99997C3.0013 3.63178 3.29978 3.3333 3.66797 3.3333H7.0013C7.36949 3.3333 7.66797 3.03483 7.66797 2.66664C7.66797 2.29845 7.36949 1.99997 7.0013 1.99997H3.66797Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </div>
  );
}
