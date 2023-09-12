import clsx from 'clsx';
import { usePathname, useRouter } from 'next-intl/client';
import { useCallback } from 'react';

type localeType = 'en' | 'ar' | 'id';
interface LocalesSwitcherProps {
  isActive: boolean;
  locale: localeType;
}
export function LocaleSwitcher({ isActive, locale }: LocalesSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = useCallback(() => {
    router.push(pathname, { locale });
  }, [locale, pathname, router]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'duration-200" min-w-[170px] px-[16px] py-[12px] text-base font-[500] text-white transition-colors',
        isActive
          ? 'pointer-events-none select-none'
          : 'hover:text-islamic-primary-green cursor-pointer ',
      )}
    >
      <div className="flex items-center justify-between">
        {locale === 'ar' && 'العربية'}
        {locale === 'en' && 'EN'}
        {locale === 'id' && 'Bahasa Indonesia'}

        {isActive && (
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
              d="M19.7599 5.28089C20.2491 5.70021 20.3058 6.43673 19.8864 6.92594L9.88646 18.5926C9.66481 18.8512 9.34124 19 9.00066 19C8.66008 19 8.33651 18.8512 8.11486 18.5926L4.11487 13.9259C3.69555 13.4367 3.7522 12.7002 4.24141 12.2809C4.73063 11.8616 5.46714 11.9182 5.88647 12.4074L9.00066 16.0406L18.1148 5.40743C18.5342 4.91822 19.2707 4.86156 19.7599 5.28089Z"
              fill="#F5F5F5"
            />
          </svg>
        )}
      </div>
    </div>
    // <select
    //   className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6"
    //   defaultValue={locale}
    //   disabled={isPending}
    //   onChange={onSelectChange}
    // >
    //   {['en', 'ar'].map((cur) => {
    //     return (
    //       <option key={cur} value={cur}>
    //         {t('locale', { locale: cur })}
    //       </option>
    //     );
    //   })}
    // </select>
  );
}
