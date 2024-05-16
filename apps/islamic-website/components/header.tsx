'use client';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { useMediaQuery } from 'react-responsive';
import { LocaleType } from '@haqq/islamic-website/shariah-page';
import { CheckMarkIcon } from '@haqq/islamic-website-ui-kit';

const DesktopHeader = dynamic(
  async () => {
    const { DesktopHeader } = await import('./header-desktop');
    return { default: DesktopHeader };
  },
  // { ssr: false },
);
const MobileHeader = dynamic(
  async () => {
    const { MobileHeader } = await import('./header-mobile');
    return { default: MobileHeader };
  },
  { ssr: false },
);

const { Link } = createSharedPathnamesNavigation({
  locales: [
    'en',
    // 'ar', 'id'
  ],
});

export const localeDisplayNames: Record<string, string> = {
  ar: 'العربية',
  en: 'English',
  id: 'Bahasa Indonesia',
};

export function LanguageLink({
  href,
  locale,
  isActive,
}: {
  href: string;
  locale: LocaleType;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      locale={locale}
      className={clsx(
        'min-w-[170px] px-[16px] py-[12px] text-base font-[500] text-white transition-colors duration-200',
        isActive
          ? 'pointer-events-none select-none'
          : 'hover:text-islamic-primary-green cursor-pointer',
      )}
    >
      <div className="flex items-center justify-between">
        <span>{localeDisplayNames[locale]}</span>
        {isActive && <CheckMarkIcon />}
      </div>
    </Link>
  );
}

export function Header({
  isBannerVisible = false,
  locale,
  className,
  isBuyButtonVisible = true,
}: {
  isBannerVisible?: boolean;
  locale: LocaleType;
  className?: string;
  isBuyButtonVisible?: boolean;
}) {
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });

  return isDesktop ? (
    <DesktopHeader
      className={className}
      locale={locale}
      isBannerVisible={isBannerVisible}
      isBuyButtonVisible={isBuyButtonVisible}
    />
  ) : (
    <MobileHeader
      className={className}
      locale={locale}
      isBannerVisible={isBannerVisible}
      isBuyButtonVisible={isBuyButtonVisible}
    />
  );
}
