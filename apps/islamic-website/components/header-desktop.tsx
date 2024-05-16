'use client';
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { LocaleType } from '@haqq/islamic-website/shariah-page';
import {
  Container,
  AcademyIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  CommunityIcon,
  EcosystemIcon,
  MissionIcon,
  NewsIcon,
  RoadmapIcon,
  ValuesIcon,
  DropdownLink,
  HalfMoonAndStarIcon,
  AlertIcon,
  StarIcon,
  QuestionMarkIcon,
  CubeIcon,
  Button,
  IslamicHeaderLogo,
} from '@haqq/islamic-website-ui-kit';

interface HeaderLinkProps {
  url: string;
  isOutLink?: boolean;
}

function DesktopHeaderLink({
  children,
  url,
  isOutLink = false,
}: PropsWithChildren<HeaderLinkProps>) {
  return (
    <Link
      href={url}
      target={isOutLink ? '_blank' : undefined}
      rel={isOutLink ? 'noopener noreferrer' : undefined}
      className="hover:text-islamic-primary-green p-[16px] text-[14px] font-[400] uppercase leading-[24px] text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

function HeaderDropdown({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setDropdownOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <div
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hover:text-islamic-primary-green group-hover:text-islamic-primary-green flex cursor-default items-center gap-x-[4px] p-[16px] text-white transition-colors duration-200">
        <span className="text-[14px] uppercase leading-[20px]">{title}</span>
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
            d="M6.29289 8.79289C6.68342 8.40237 7.31658 8.40237 7.70711 8.79289L12 13.0858L16.2929 8.79289C16.6834 8.40237 17.3166 8.40237 17.7071 8.79289C18.0976 9.18342 18.0976 9.81658 17.7071 10.2071L12.7071 15.2071C12.5196 15.3946 12.2652 15.5 12 15.5C11.7348 15.5 11.4804 15.3946 11.2929 15.2071L6.29289 10.2071C5.90237 9.81658 5.90237 9.18342 6.29289 8.79289Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={isDropdownOpen}
      >
        <div className="absolute left-1/2 top-full min-w-max origin-center translate-x-[-50%]">
          <div className="w-fit rounded-xl bg-[#15191ef2] p-[8px] backdrop-blur">
            {children}
          </div>
        </div>
      </Transition>
    </div>
  );
}

const { Link } = createSharedPathnamesNavigation({
  locales: [
    'en',
    // 'ar', 'id'
  ],
});

export function DesktopHeader({
  isBannerVisible = false,
  locale,
  className,
  isBuyButtonVisible = false,
}: {
  isBannerVisible?: boolean;
  locale: LocaleType;
  className?: string;
  isBuyButtonVisible?: boolean;
}) {
  const [isBlurred, setBlurred] = useState(false);

  useEffect(() => {
    const offset = 50;

    function handleScroll() {
      if (window.scrollY > offset) {
        setBlurred(true);
      } else {
        setBlurred(false);
      }
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const t = useTranslations('header');

  return (
    <header
      className={clsx(
        'sticky z-50 w-full',
        'transform-gpu transition-all duration-150 will-change-auto',
        isBlurred && 'translate-y-[-16px]',
        isBannerVisible ? 'top-[40px]' : 'top-[0px]',
        className,
      )}
    >
      <div className="pb-[10px] pt-[26px]">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="hover:text-islamic-primary-green leading-[0] text-white transition-colors duration-150"
              >
                <IslamicHeaderLogo />
              </Link>
            </div>

            <nav className="flex flex-row items-center">
              <DesktopHeaderLink url="/shariah">
                {t('single-links.shariah')}
              </DesktopHeaderLink>
              <HeaderDropdown title={t('dropdown-links.about.about')}>
                <div className="flex gap-x-[18px]">
                  <div className="flex flex-col">
                    <DropdownLink
                      title={t('dropdown-links.about.mission')}
                      icon={<MissionIcon />}
                      href="/mission"
                    />
                    <DropdownLink
                      title={t('dropdown-links.about.roadmap')}
                      icon={<RoadmapIcon />}
                      href="/roadmap"
                    />
                    <DropdownLink
                      title={t('dropdown-links.about.whitepaper')}
                      icon={<HalfMoonAndStarIcon />}
                      href="/whitepaper"
                    />
                    <DropdownLink
                      title={t('dropdown-links.about.ecosystem')}
                      icon={<EcosystemIcon />}
                      href="https://haqq.network/ecosystem"
                      isOutLink
                    />
                  </div>
                  <div className="flex flex-col">
                    <DropdownLink
                      title={t('dropdown-links.about.news')}
                      icon={<NewsIcon />}
                      href="/news"
                    />
                    <DropdownLink
                      title={t('dropdown-links.about.build-on-haqq')}
                      icon={<BuildIcon />}
                      href="/build"
                    />
                    <DropdownLink
                      title={t('dropdown-links.about.validator-program')}
                      icon={<CubeIcon />}
                      href="/validators"
                    />
                  </div>
                </div>
              </HeaderDropdown>

              <DesktopHeaderLink url="/wallet">
                {t('single-links.wallet')}
              </DesktopHeaderLink>

              <HeaderDropdown title={t('dropdown-links.learn.learn')}>
                <div className="flex flex-col">
                  <DropdownLink
                    title={t('dropdown-links.learn.academy')}
                    icon={<AcademyIcon />}
                    href="/academy"
                  />
                  <DropdownLink
                    title={t('dropdown-links.learn.privacy-policy')}
                    icon={<QuestionMarkIcon />}
                    href="/privacy-policy"
                  />
                  <DropdownLink
                    title={t('dropdown-links.learn.blog')}
                    icon={<BlogIcon />}
                    href="/blog"
                  />
                  <DropdownLink
                    title={t('dropdown-links.learn.fraud-alert')}
                    icon={<AlertIcon />}
                    href="/fraud-alert"
                  />
                  <DropdownLink
                    title={t('dropdown-links.learn.scam-alert')}
                    icon={<AlertIcon />}
                    href="/scam-alert"
                  />
                </div>
              </HeaderDropdown>

              <HeaderDropdown title={t('dropdown-links.team.team')}>
                <div className="flex gap-x-[18px]">
                  <div className="flex flex-col">
                    <DropdownLink
                      title={t('dropdown-links.team.career')}
                      icon={<CaseIcon />}
                      href="/career"
                    />
                    <DropdownLink
                      title={t('dropdown-links.team.our-values')}
                      icon={<ValuesIcon />}
                      href="/values"
                    />
                    <DropdownLink
                      title={t('dropdown-links.team.community')}
                      icon={<CommunityIcon />}
                      href="/community-hub"
                    />
                    <DropdownLink
                      title={t('dropdown-links.team.meet-our-team')}
                      icon={<StarIcon />}
                      href="/team"
                    />
                  </div>
                </div>
              </HeaderDropdown>

              {/* <HeaderDropdown title={localeDisplayNames[locale]}>
                <div className="flex flex-col">
                  <LanguageLink
                    href={pathname}
                    locale="en"
                    isActive={locale === 'en'}
                  />

                  <LanguageLink
                    href={pathname}
                    isActive={locale === 'ar'}
                    locale="ar"
                  />

                  <LanguageLink
                    href={pathname}
                    isActive={locale === 'id'}
                    locale="id"
                  />
                </div>
              </HeaderDropdown> */}

              {isBuyButtonVisible && (
                <Link href="/markets" className="ml-[8px]" data-attr="buy-islm">
                  <Button>Buy ISLM</Button>
                </Link>
              )}
            </nav>
          </div>
        </Container>
      </div>

      <div
        className={clsx(
          'absolute inset-0 z-[-1]',
          'transform-gpu transition-all duration-150 will-change-auto',
          isBlurred ? 'bg-[#010304CC] backdrop-blur-md' : 'bg-transparent',
        )}
      />
    </header>
  );
}
