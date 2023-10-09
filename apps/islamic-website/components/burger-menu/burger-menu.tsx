import {
  AcademyIcon,
  AlertIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  CommunityIcon,
  EcosystemIcon,
  HalfMoonAndStarIcon,
  MissionIcon,
  NewsIcon,
  QuestionMarkIcon,
  RoadmapIcon,
  StarIcon,
  ValuesIcon,
} from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { LanguageLink } from '../header/header';
import { usePathname } from 'next-intl/client';

function BurgerMenuDropdownLink({
  icon,
  title,
  href,
  onClick,
  isOutLink = false,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
  onClick?: () => void;
  isOutLink?: boolean;
}) {
  return (
    <Link
      href={href}
      className="hover:text-islamic-primary-green w-fit py-[12px] text-base font-[500] text-white transition-colors duration-200"
      onClick={onClick}
      target={isOutLink ? '_blank' : undefined}
      rel={isOutLink ? 'noopener noreferrer' : undefined}
    >
      <div className="flex flex-row items-center gap-x-[10px]">
        {icon && <div>{icon}</div>}
        <div>{title}</div>
      </div>
    </Link>
  );
}

export function BurgerMenu({
  className,
  isOpen,
  onClick,
  locale,
}: {
  className?: string;
  isOpen?: boolean;
  onClick: () => void;
  locale: string;
}) {
  const t = useTranslations('header');
  const [isLocaleSwitcherOpened, setIsLocaleSwitcherOpened] = useState(false);

  const toggleLocaleMenu = useCallback(() => {
    return setIsLocaleSwitcherOpened(!isLocaleSwitcherOpened);
  }, [isLocaleSwitcherOpened]);

  const pathname = usePathname();

  return (
    <div className={clsx('px-[16px] md:px-[48px]', className)}>
      {!isLocaleSwitcherOpened ? (
        <div className="flex flex-col gap-y-[12px]">
          <Link
            href="/shariah"
            className="hover:text-islamic-primary-green z-50 py-[12px] text-base uppercase text-white transition-colors duration-200"
            onClick={onClick}
          >
            {t('single-links.shariah')}
          </Link>
          <MobileMenuDropdownLink title={t('dropdown-links.about.about')}>
            <div className="flex flex-col">
              <BurgerMenuDropdownLink
                title={t('dropdown-links.about.mission')}
                icon={<MissionIcon />}
                href="/mission"
                onClick={onClick}
              />
              <BurgerMenuDropdownLink
                title={t('dropdown-links.about.whitepaper')}
                icon={<HalfMoonAndStarIcon />}
                href="/whitepaper"
                onClick={onClick}
              />
              <BurgerMenuDropdownLink
                title={t('dropdown-links.about.roadmap')}
                icon={<RoadmapIcon />}
                href="/roadmap"
                onClick={onClick}
              />
              <BurgerMenuDropdownLink
                title={t('dropdown-links.about.news')}
                icon={<NewsIcon />}
                href="/news"
                onClick={onClick}
              />
              <BurgerMenuDropdownLink
                title={t('dropdown-links.about.ecosystem')}
                icon={<EcosystemIcon />}
                href="https://haqq.network/ecosystem"
                isOutLink
                onClick={onClick}
              />
              <BurgerMenuDropdownLink
                title={t('dropdown-links.about.build-on-haqq')}
                icon={<BuildIcon />}
                href="/build"
                onClick={onClick}
              />
            </div>
          </MobileMenuDropdownLink>
          <Link
            href="/wallet"
            className="hover:text-islamic-primary-green z-50 py-[12px] text-base uppercase text-white transition-colors duration-200"
            onClick={onClick}
          >
            {t('single-links.wallet')}
          </Link>
          <MobileMenuDropdownLink title={t('dropdown-links.learn.learn')}>
            <BurgerMenuDropdownLink
              title={t('dropdown-links.learn.academy')}
              icon={<AcademyIcon />}
              href="/academy"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Privacy Policy"
              icon={<QuestionMarkIcon />}
              href="/privacy-policy"
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.learn.blog')}
              icon={<BlogIcon />}
              href="https://haqq.network/blog"
              isOutLink
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.learn.fraud-alert')}
              icon={<AlertIcon />}
              href="/fraud-alert"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.learn.scam-alert')}
              icon={<AlertIcon />}
              href="/scam-alert"
              onClick={onClick}
            />
          </MobileMenuDropdownLink>
          <MobileMenuDropdownLink title={t('dropdown-links.team.team')}>
            <BurgerMenuDropdownLink
              title={t('dropdown-links.team.career')}
              icon={<CaseIcon />}
              href="/career"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.team.our-values')}
              icon={<ValuesIcon />}
              href="/values"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.team.community')}
              icon={<CommunityIcon />}
              href="/community-hub"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.team.meet-our-team')}
              icon={<StarIcon />}
              href="/team"
              onClick={onClick}
            />
          </MobileMenuDropdownLink>
          <MobileMenuLangButton onClick={toggleLocaleMenu} locale={locale} />
        </div>
      ) : (
        <div className="flex flex-col gap-y-[12px]">
          <MobileMenuLangButton onClick={toggleLocaleMenu} isBackButton />
          <LanguageLink
            isActive={locale === 'en'}
            locale="en"
            href={pathname}
          />
          <LanguageLink
            isActive={locale === 'ar'}
            locale="ar"
            href={pathname}
          />
          <LanguageLink
            isActive={locale === 'id'}
            locale="id"
            href={pathname}
          />
        </div>
      )}
    </div>
  );
}

function MobileMenuDropdownLink({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) {
  const [isSelectorOpened, setIsSelectorOpened] = useState(false);

  const toggleSelector = useCallback(() => {
    return setIsSelectorOpened(!isSelectorOpened);
  }, [isSelectorOpened]);

  return (
    <Fragment>
      <div
        onClick={toggleSelector}
        className="hover:text-islamic-primary-green z-50 flex cursor-default items-center justify-between py-[12px] text-base uppercase text-white transition-colors duration-200"
      >
        <div>{title}</div>

        <div
          className={clsx(
            'mr-[6px] transform transition-transform duration-100',
            isSelectorOpened && 'rotate-180',
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0234 17.2471C12.292 17.2471 12.5283 17.1504 12.7324 16.9463L21.0576 8.42773C21.251 8.24512 21.3477 8.00879 21.3477 7.72949C21.3477 7.1709 20.9287 6.74121 20.3701 6.74121C20.0908 6.74121 19.8545 6.85937 19.6719 7.03125L12.0234 14.8516L4.375 7.03125C4.19238 6.85937 3.94531 6.74121 3.67676 6.74121C3.11816 6.74121 2.69922 7.1709 2.69922 7.72949C2.69922 8.00879 2.7959 8.24512 2.97852 8.42773L11.3145 16.9463C11.5078 17.1504 11.7549 17.2471 12.0234 17.2471Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      {isSelectorOpened && children}
    </Fragment>
  );
}

function MobileMenuLangButton({
  onClick,
  locale,
  isBackButton = false,
}: {
  onClick: () => void;
  locale?: string;
  isBackButton?: boolean;
}) {
  const t = useTranslations('header.burger-menu.back-button');
  return (
    <div
      className={clsx(
        'hover:text-islamic-primary-green flex cursor-default items-center gap-x-[10px] py-[12px] text-base font-[500] uppercase text-white transition-colors duration-200',
        isBackButton ? 'items-start px-[16px]' : 'justify-between',
      )}
      onClick={onClick}
    >
      {isBackButton ? (
        <Fragment>
          <div className="mr-[6px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.77148 11.9941C6.77148 12.2627 6.86816 12.499 7.07227 12.7031L15.5908 21.0283C15.7734 21.2217 16.0098 21.3184 16.2891 21.3184C16.8477 21.3184 17.2773 20.8994 17.2773 20.3408C17.2773 20.0615 17.1592 19.8252 16.9873 19.6426L9.16699 11.9941L16.9873 4.3457C17.1592 4.16309 17.2773 3.91602 17.2773 3.64746C17.2773 3.08887 16.8477 2.66992 16.2891 2.66992C16.0098 2.66992 15.7734 2.7666 15.5908 2.94922L7.07227 11.2852C6.86816 11.4785 6.77148 11.7256 6.77148 11.9941Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span>{t('title')}</span>
        </Fragment>
      ) : (
        <Fragment>
          <span>
            {locale === 'en' && 'En'}
            {locale === 'ar' && 'عربي'}
            {locale === 'id' && 'Bahasa Indonesia'}
          </span>
          <div className="mr-[6px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.2773 11.9941C17.2773 11.7256 17.1807 11.4893 16.9766 11.2852L8.45801 2.95996C8.27539 2.7666 8.03906 2.66992 7.75977 2.66992C7.20117 2.66992 6.77149 3.08887 6.77149 3.64746C6.77149 3.92676 6.88965 4.16309 7.06152 4.3457L14.8818 11.9941L7.06152 19.6426C6.88965 19.8252 6.77148 20.0723 6.77148 20.3408C6.77148 20.8994 7.20117 21.3184 7.75977 21.3184C8.03906 21.3184 8.27539 21.2217 8.45801 21.0391L16.9766 12.7031C17.1807 12.5098 17.2773 12.2627 17.2773 11.9941Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Fragment>
      )}
    </div>
  );
}
